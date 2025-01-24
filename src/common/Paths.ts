/* Express router paths go here. */

export default {
  Base: '/api',
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Users2:{
    Base:'/useres',
    Get: '/all',
    GetOne:'/getone/:id',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Posts:{
    Base: '/Posts',
    Get: '/all',
    GetOne: "/getone/:id",
    GetFromUser: "/creator/:email",
    GetPageFromCreator:"/creator/:email/page/:page/limit/:limit",
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  }

} as const;
