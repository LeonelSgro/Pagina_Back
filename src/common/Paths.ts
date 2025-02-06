/* Express router paths go here. */

export default {
  Base: '/api',
  
  Users2:{
    Base:'/useres',
    Get: '/all',
    GetOne:'/getone/:id',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
    Login: '/login'
  },
  Posts:{
    Base: '/Posts',
    Get: '/all',
    GetOne: "/getone/:id",
    Add: '/add/:id',  
    Update: '/update/:id',
    Delete: '/delete/:id',
  }

} as const;
