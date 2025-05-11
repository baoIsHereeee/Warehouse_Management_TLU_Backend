import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.join(__dirname, `../../configs/.env`),
});

export interface PermissionDefinition {
    name: string;
    description: string;
}

export interface RoleDefinition {
    name: string;
}

export const permissions: PermissionDefinition[] = [
    { name: "get_all_users", description: "Allows retrieving a list of all users" },

    { name: "get_user_by_id", description: "Allows retrieving a specific user by ID" },

    { name: "create_user", description: "Allows creating a new user account" },

    { name: "update_user", description: "Allows updating an existing user account" },

    { name: "delete_user", description: "Allows deleting a user account" },

    { name: "add_user_role", description: "Allows adding role to an user" },

    { name: "delete_user_role", description: "Allows removing role of an user" },

    { name: "get_all_roles", description: "Allows retrieving all roles data" },

    { name: "get_role_by_id", description: "Allows retrieving a specific role by ID" },

    { name: "create_role", description: "Allows creating new role" },
    
    { name: "update_role", description: "Allows updating an exist role" },
    
    { name: "delete_role", description: "Allows deleting a role" },

    { name: "get_all_permissions", description: "Allows retrieving all permission data" },

    { name: "create_role_permission", description: "Allows applying a permission to a role" },

    { name: "delete_role_permission", description: "Allows removing a permission from a role" },
]

export const roles: RoleDefinition[] = [
    { name: "Admin" },
    { name: "Manager" },
    { name: "Staff" },
]

export const defaultUsers = [
    {
        fullname: "Default Admin",
        age: 20,
        email: process.env.DEFAULT_ADMIN_EMAIL as string,
        password: process.env.DEFAULT_ADMIN_PASSWORD as string
    }
]

export const rolesPermissions = [
    { 
        role: "Admin",
        permissions: [
            "get_all_users",
            "get_user_by_id",
            "create_user",
            "update_user",
            "delete_user",
            "add_user_role",
            "delete_user_role",
            "get_all_roles",
            "get_role_by_id",
            "create_role",
            "update_role",
            "delete_role",
            "get_all_permissions",
            "create_role_permission",
            "delete_role_permission"
          ]
    }, 

    {
        role: "Manager",
        permissions: [
            "get_all_users",
            "get_user_by_id",
        ]
    },

    {
        role: "Staff",
        permissions: [
            
        ]
    }
]