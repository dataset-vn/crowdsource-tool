
export const API_CONFIG = {
  gateway: `${window.APP_SETTINGS.hostname}/api`,
  endpoints: {
    // Organization
    memberships: "/organizations/:pk/memberships",
    inviteLink: "/invite",
    resetInviteLink: "POST:/invite/reset-token",
    organizations: "GET:/organizations",
    postOrganizations:"POST:/organizations",

    // Current user's active organization
    patchActiveOrganization: "PATCH:/current-user/active-organization",
    getActiveOrganization: "GET:/current-user/active-organization",

    // Project
    projects: "/projects",
    project: "/projects/:pk",
    updateProject: "PATCH:/projects/:pk",
    createProject: "POST:/projects",
    deleteProject: "DELETE:/projects/:pk",

    // ProjectMember
    getProjectMember: "/projects/:pk/members",
    createProjectMember: "POST:/projects/:pk/members", // Gui body kem theo user_pk. Vi du body: {user_pk: 2}
    
    //deleteProjectMember: "DELETE:/api/projects/:pk/members"

    // Config and Import
    configTemplates: "/templates",
    validateConfig: "POST:/projects/:pk/validate",
    createSampleTask: "POST:/projects/:pk/sample-task",
    fileUploads: "/projects/:pk/file-uploads",
    deleteFileUploads: "DELETE:/projects/:pk/file-uploads",
    importFiles: "POST:/projects/:pk/import",
    reimportFiles: "POST:/projects/:pk/reimport",
    dataSummary: "/projects/:pk/summary",

    // DM
    deleteTabs: 'DELETE:/dm/views/reset',

    // Storages
    listStorages: "/storages/:target?",
    storageTypes: "/storages/:target?/types",
    storageForms: "/storages/:target?/:type/form",
    createStorage: "POST:/storages/:target?/:type",
    deleteStorage: "DELETE:/storages/:target?/:type/:pk",
    updateStorage: "PATCH:/storages/:target?/:type/:pk",
    syncStorage: "POST:/storages/:target?/:type/:pk/sync",
    validateStorage: "POST:/storages/:target?/:type/validate",

    // ML
    mlBackends: "GET:/ml",
    mlBackend: "GET:/ml/:pk",
    addMLBackend: "POST:/ml",
    updateMLBackend: "PATCH:/ml/:pk",
    deleteMLBackend: "DELETE:/ml/:pk",
    trainMLBackend: "POST:/ml/:pk/train",
    predictWithML: "POST:/ml/:pk/predict",

    // Export
    export: "/projects/:pk/export",
    previousExports: "/projects/:pk/export/files",
    exportFormats: "/projects/:pk/export/formats",

    // Version
    version: '/version',
  },
  alwaysExpectJSON: false,
};
