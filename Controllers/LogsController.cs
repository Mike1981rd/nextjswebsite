using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace WebsiteBuilderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogsController : ControllerBase
    {
        private readonly ILogger<LogsController> _logger;
        private readonly string _logDirectory;

        public LogsController(ILogger<LogsController> logger)
        {
            _logger = logger;
            _logDirectory = Path.Combine(Directory.GetCurrentDirectory(), "logs", "frontend");
            
            // Ensure directory exists
            if (!Directory.Exists(_logDirectory))
            {
                Directory.CreateDirectory(_logDirectory);
            }
        }

        [HttpPost("frontend")]
        [AllowAnonymous] // Allow frontend to send logs without authentication
        public async Task<IActionResult> LogFrontendErrors([FromBody] FrontendLogRequest request)
        {
            try
            {
                if (request?.Logs == null || !request.Logs.Any())
                {
                    return BadRequest("No logs provided");
                }

                var today = DateTime.Now.ToString("yyyyMMdd");
                
                // Process each log entry
                foreach (var log in request.Logs)
                {
                    // Determine file based on type
                    string fileName = log.Type switch
                    {
                        "network" => $"frontend-network-{today}.log",
                        "exception" => $"frontend-exceptions-{today}.log",
                        "promise" => $"frontend-exceptions-{today}.log",
                        _ => $"frontend-errors-{today}.log"
                    };

                    var filePath = Path.Combine(_logDirectory, fileName);
                    
                    // Format log entry
                    var logEntry = FormatLogEntry(log);
                    
                    // Append to file
                    await System.IO.File.AppendAllTextAsync(filePath, logEntry);
                    
                    // Also log to backend logger based on level
                    switch (log.Level)
                    {
                        case "error":
                            _logger.LogError("Frontend Error: {Message} | Type: {Type} | URL: {Url}", 
                                log.Message, log.Type, log.Url);
                            break;
                        case "warn":
                            _logger.LogWarning("Frontend Warning: {Message} | Type: {Type} | URL: {Url}", 
                                log.Message, log.Type, log.Url);
                            break;
                        default:
                            _logger.LogInformation("Frontend Log: {Message} | Type: {Type} | URL: {Url}", 
                                log.Message, log.Type, log.Url);
                            break;
                    }
                }

                return Ok(new { message = $"Logged {request.Logs.Count} entries" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing frontend logs");
                return StatusCode(500, new { error = "Failed to process logs" });
            }
        }

        private string FormatLogEntry(FrontendLogEntry log)
        {
            var entry = new List<string>
            {
                "================================================================================",
                $"[{log.Timestamp}] [{log.Level.ToUpper()}] [{log.Type.ToUpper()}]",
                $"URL: {log.Url}",
                $"Message: {log.Message}"
            };

            if (!string.IsNullOrEmpty(log.UserAgent))
            {
                entry.Add($"User Agent: {log.UserAgent}");
            }

            if (log.NetworkDetails != null)
            {
                entry.Add("Network Details:");
                entry.Add($"  Method: {log.NetworkDetails.Method}");
                entry.Add($"  URL: {log.NetworkDetails.Url}");
                entry.Add($"  Status: {log.NetworkDetails.Status} {log.NetworkDetails.StatusText}");
                
                if (log.NetworkDetails.RequestBody != null)
                {
                    entry.Add($"  Request Body: {JsonSerializer.Serialize(log.NetworkDetails.RequestBody)}");
                }
                
                if (log.NetworkDetails.ResponseBody != null)
                {
                    var responseStr = JsonSerializer.Serialize(log.NetworkDetails.ResponseBody);
                    if (responseStr.Length > 1000)
                    {
                        responseStr = responseStr.Substring(0, 1000) + "... (truncated)";
                    }
                    entry.Add($"  Response Body: {responseStr}");
                }
            }

            if (!string.IsNullOrEmpty(log.Stack))
            {
                entry.Add("Stack Trace:");
                entry.Add(log.Stack);
            }

            if (log.Details != null)
            {
                var detailsStr = JsonSerializer.Serialize(log.Details, new JsonSerializerOptions 
                { 
                    WriteIndented = true 
                });
                entry.Add($"Additional Details: {detailsStr}");
            }

            entry.Add("");
            
            return string.Join(Environment.NewLine, entry) + Environment.NewLine;
        }
    }

    public class FrontendLogRequest
    {
        public List<FrontendLogEntry> Logs { get; set; } = new();
    }

    public class FrontendLogEntry
    {
        public string Timestamp { get; set; } = "";
        public string Level { get; set; } = "info";
        public string Type { get; set; } = "console";
        public string Message { get; set; } = "";
        public object? Details { get; set; }
        public string? Url { get; set; }
        public string? UserAgent { get; set; }
        public string? Stack { get; set; }
        public NetworkDetails? NetworkDetails { get; set; }
    }

    public class NetworkDetails
    {
        public string? Method { get; set; }
        public string? Url { get; set; }
        public int? Status { get; set; }
        public string? StatusText { get; set; }
        public object? RequestBody { get; set; }
        public object? ResponseBody { get; set; }
        public Dictionary<string, string>? Headers { get; set; }
    }
}