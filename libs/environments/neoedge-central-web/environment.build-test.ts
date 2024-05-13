export const environment = {
  production: true,
  basePath: 'https://api.neoedge-test.net/api/v2',
  authPath: 'https://api.neoedge-test.net/api',
  eulaVersion: '1.0',
  socket: {
    host: location.host
  },
  permissionOptions: [
    {
      permissionName: 'Company Account',
      permissionId: 100,
      desc: 'Authorize the necessary permissions to manage and update the company profile, access business data, and oversee NeoEdge X license, NeoEdge Central subscription plan, as well as monitor and maintain usage and billing records.'
    },
    {
      permissionName: 'User Management',
      permissionId: 200,
      desc: 'Authorize the necessary permissions to invite new users, allocate roles and projects, activate/deactivate, and manage the deletion of users within the company account.'
    },
    {
      permissionName: 'Project Management',
      permissionId: 300,
      desc: 'Authorize the necessary permissions to create, update, and delete projects, enabling them to effectively manage the entire lifecycle of projects within the organization.'
    },
    {
      permissionName: 'Application Management',
      permissionId: 400,
      desc: 'Authorize the necessary permissions to enroll new Gateways on NeoEdge Central, oversee the entire lifecycle management of Gateways, facilitate the upgrading of NeoEdge X software, and enable remote access to Gateways. Additionally, grant permission for the creation, design, and deployment of IIoT applications, including OT Devices, IT Apps, and NeoFlows on NeoEdge Central.'
    }
  ]
};
