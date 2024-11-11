/**
 * Express router paths go here.
 */

export default {
  Base: '/api',
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Usuario: {
    Base:'/usuarios',
    Get:'',
    Add:'',
    Update:'',
    Delete:'',
  },
} as const;
