export { }

// Create a type for the roles
export type Roles = 'superadmin' | 'educator' | 'student'

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Roles
        }
    }
}