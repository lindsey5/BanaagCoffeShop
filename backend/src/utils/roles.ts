import PERMISSIONS from "./permissions";

const ROLES = {
    OWNER: {
        name: 'Owner',
        description: 'Full access to the system',
        permissions: Object.values(PERMISSIONS)
    },
}

export default ROLES;