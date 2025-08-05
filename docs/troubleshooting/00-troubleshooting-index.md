# 🔧 Troubleshooting Master Index

## Quick Navigation
- [Authentication Issues](#authentication-issues)
- [API Integration Issues](#api-integration-issues)
- [General Issues](#general-issues)
- [Most Common Problems](#most-common-problems)
- [Contributing](#contributing)

---

## 🔍 Search by Keywords

**Authentication**: JWT, login, token, authorization, roles, permissions, cookies, session
**API**: CORS, 404, 500, connection refused, network error, axios, fetch
**General**: hot reload, npm errors, migration, database, Visual Studio

---

## 📁 Category Indices

### Authentication Issues
[📂 View Auth Index](./auth/auth-00-index.md)
- JWT setup and configuration
- Login/logout problems
- Token validation issues
- Next.js authentication integration
- Role-based access control

### API Integration Issues
[📂 View API Index](./api/api-00-index.md)
- CORS configuration problems
- ASP.NET Core + Next.js integration
- Port configuration issues
- Request/Response errors
- Middleware conflicts

### General Issues
[📂 View General Index](./general/general-00-index.md)
- Development environment setup
- Database migrations
- Build and deployment
- Performance issues
- Hot reload problems

---

## ⚡ Most Common Problems

### 1. **Login Returns Network Error**
**Symptoms**: `net::ERR_CONNECTION_REFUSED` when trying to login
**Quick Fix**: Check API port configuration
**Full Solution**: [API-02: ASP.NET + Next.js Integration](./api/api-02-aspnet-nextjs-integration.md)

### 2. **Token Not Persisting After Login**
**Symptoms**: Redirected back to login after successful authentication
**Quick Fix**: Check localStorage vs cookies configuration
**Full Solution**: [Auth-03: Next.js Integration](./auth/auth-03-nextjs-integration.md)

### 3. **CORS Errors in Browser Console**
**Symptoms**: `Access-Control-Allow-Origin` errors
**Quick Fix**: Update CORS policy in Program.cs
**Full Solution**: [API-01: CORS Problems](./api/api-01-cors-problems.md)

### 4. **404 on /api/auth/me**
**Symptoms**: 404 error when checking authentication status
**Quick Fix**: This is normal when not authenticated
**Full Solution**: [Auth-02: Token Validation](./auth/auth-02-token-validation.md)

### 5. **Multiple DbContext Error During Migration**
**Symptoms**: "More than one DbContext was found"
**Quick Fix**: Use `-Context ApplicationDbContext`
**Full Solution**: [General-01: Database Issues](./general/general-01-database-issues.md)

---

## 📝 Contributing

### Found a New Problem?

1. **Check if it exists**: Search this index and category indices
2. **Choose the right category**: auth, api, or general
3. **Create a new file**: Follow naming convention `category-##-descriptive-name.md`
4. **Use the template**: Copy from `_template.md`
5. **Update indices**: Add your problem to relevant index files
6. **Cross-reference**: Link related problems

### File Naming Convention
```
auth-01-jwt-setup-issues.md
api-02-aspnet-nextjs-integration.md
general-03-npm-errors.md
```

### Template Structure
Every problem file should include:
- Problem summary
- Symptoms checklist
- Root causes
- Solutions (quick fix + detailed)
- Prevention tips
- Related problems
- Search keywords

---

## 🏷️ Tags
`troubleshooting` `debugging` `errors` `solutions` `websitebuilder`

---

**Last Updated**: August 2025
**Version**: 1.0.0