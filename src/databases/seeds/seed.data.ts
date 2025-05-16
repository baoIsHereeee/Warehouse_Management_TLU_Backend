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
    // User
    { name: "get_all_users", description: "Allows retrieving a list of all users" },

    { name: "get_user_by_id", description: "Allows retrieving a specific user by ID" },

    { name: "create_user", description: "Allows creating a new user account" },

    { name: "update_user", description: "Allows updating an existing user account" },

    { name: "delete_user", description: "Allows deleting a user account" },

    { name: "add_user_role", description: "Allows adding role to an user" },

    { name: "delete_user_role", description: "Allows removing role of an user" },

    // Role
    { name: "get_all_roles", description: "Allows retrieving all roles data" },

    { name: "get_role_by_id", description: "Allows retrieving a specific role by ID" },

    { name: "create_role", description: "Allows creating new role" },
    
    { name: "update_role", description: "Allows updating an exist role" },
    
    { name: "delete_role", description: "Allows deleting a role" },

    // Permission
    { name: "get_all_permissions", description: "Allows retrieving all permission data" },

    { name: "create_role_permission", description: "Allows applying a permission to a role" },

    { name: "delete_role_permission", description: "Allows removing a permission from a role" },

    // Category
    { name: "get_all_categories", description: "Allows retrieving all categories data" },

    { name: "get_category_by_id", description: "Allows retrieving a specific category by ID" },

    { name: "create_category", description: "Allows creating new category" },
    
    { name: "update_category", description: "Allows updating an exist category" },
    
    { name: "delete_category", description: "Allows deleting a category" },

    // Customer
    { name: "get_all_customers", description: "Allows retrieving all customers data" },

    { name: "get_customer_by_id", description: "Allows retrieving a specific customer by ID" },

    { name: "create_customer", description: "Allows creating new customer" },
    
    { name: "update_customer", description: "Allows updating an exist customer" },
    
    { name: "delete_customer", description: "Allows deleting a customer" },

    // Supplier
    { name: "get_all_suppliers", description: "Allows retrieving all suppliers data" },

    { name: "get_supplier_by_id", description: "Allows retrieving a specific supplier by ID" },

    { name: "create_supplier", description: "Allows creating new supplier" },
    
    { name: "update_supplier", description: "Allows updating an exist supplier" },
    
    { name: "delete_supplier", description: "Allows deleting a supplier" },

    // Product
    { name: "get_all_products", description: "Allows retrieving all products data" },

    { name: "get_product_by_id", description: "Allows retrieving a specific product by ID" },

    { name: "create_product", description: "Allows creating new product" },
    
    { name: "update_product", description: "Allows updating an exist product" },
    
    { name: "delete_product", description: "Allows deleting a product" },

    // Export
    { name: "get_all_exports", description: "Allows retrieving all export records data" },

    { name: "get_export_by_id", description: "Allows retrieving a specific export record by ID" },

    { name: "create_export", description: "Allows creating new export record" },
    
    { name: "update_export", description: "Allows updating an exist export record" },
    
    { name: "delete_export", description: "Allows deleting an export record" },

    // Import
    { name: "get_all_imports", description: "Allows retrieving all import records data" },

    { name: "get_import_by_id", description: "Allows retrieving a specific import record by ID" },

    { name: "create_import", description: "Allows creating new import record" },
    
    { name: "update_import", description: "Allows updating an exist import record" },
    
    { name: "delete_import", description: "Allows deleting an import record" },

    // Warehouse
    { name: "get_all_warehouses", description: "Allows retrieving all warehouses data" },

    { name: "get_warehouse_by_id", description: "Allows retrieving a specific warehouse by ID" },

    { name: "create_warehouse", description: "Allows creating new warehouse" },
    
    { name: "update_warehouse", description: "Allows updating an exist warehouse" },
    
    { name: "delete_warehouse", description: "Allows deleting a warehouse" },
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
            "delete_role_permission",
            "get_all_categories",
            "get_category_by_id",
            "create_category",
            "update_category",
            "delete_category",
            "get_all_customers",
            "get_customer_by_id",
            "create_customer",
            "update_customer",
            "delete_customer",
            "get_all_suppliers",
            "get_supplier_by_id",
            "create_supplier",
            "update_supplier",
            "delete_supplier",
            "get_all_products",
            "get_product_by_id",
            "create_product",
            "update_product",
            "delete_product",
            "get_all_exports",
            "get_export_by_id",
            "create_export",
            "update_export",
            "delete_export",
            "get_all_imports",
            "get_import_by_id",
            "create_import",
            "update_import",
            "delete_import",
            "get_all_warehouses",
            "get_warehouse_by_id",
            "create_warehouse",
            "update_warehouse",
            "delete_warehouse"
          ]
    }, 

    {
        role: "Manager",
        permissions: [
            "get_all_users",
            "get_user_by_id",
            "get_all_categories",
            "get_category_by_id",
            "create_category",
            "update_category",
            "delete_category",
            "get_all_products",
            "get_product_by_id",
            "create_product",
            "update_product",
            "delete_product",
            "get_all_exports",
            "get_export_by_id",
            "create_export",
            "get_all_imports",
            "get_import_by_id",
            "create_import",
            "get_all_customers",
            "get_customer_by_id",
            "create_customer",
            "get_all_suppliers",
            "get_supplier_by_id",
            "create_supplier",
            "get_all_warehouses",
            "get_warehouse_by_id",
        ]
    },

    {
        role: "Staff",
        permissions: [
            "get_all_categories",
            "get_category_by_id",
            "create_category",
            "get_all_products",
            "get_product_by_id",
            "create_product",
            "get_all_exports",
            "get_export_by_id",
            "create_export",
            "get_all_imports",
            "get_import_by_id",
            "create_import",
            "get_all_customers",
            "get_customer_by_id",
            "create_customer",
            "get_all_suppliers",
            "get_supplier_by_id",
            "create_supplier",
            "get_all_warehouses",
            "get_warehouse_by_id",
        ]
    }
]