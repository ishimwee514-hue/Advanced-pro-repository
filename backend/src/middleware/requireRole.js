export function requireRole(...allowedRoles) {
  return function roleGuard(request, response, next) {
    if (!request.user) {
      return response.status(401).json({ error: 'Sign in to continue.' })
    }
    if (!allowedRoles.includes(request.user.role)) {
      return response.status(403).json({ error: 'You do not have permission to perform this action.' })
    }
    return next()
  }
}
