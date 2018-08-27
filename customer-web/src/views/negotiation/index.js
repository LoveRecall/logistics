export default {
  menuLinks: {
    'INQUIRY:OVERVIEW:DRAFT': { path: '/negotiation/draft/inquiry', text: 'draft' },
    'INQUIRY:OVERVIEW:DELETE': { path: '/negotiation/recycleBin/inquiry', text: 'archive' },
    'INQUIRY:COMPARE_ARCHIVE': { path: '/negotiation/recycleBin/compare', text: 'archive' },
    'INQUIRY:COMPARE_OVERVIEW:DELETE': {path: '/negotiation/recycleBin/compare', text: 'archive'},
    'INQUIRY:LOG': { path: '/logs/index', query: { code: 'INQUIRY', bizCode: 'INQUIRY' }, text: 'log' },

  },
  setMenuLinks(vm, auths) {
    let menus = [];
    auths.forEach(auth => {
      let menu = this.menuLinks[auth];
      if (menu && vm.$auth(auth)) {
        menu.label = vm.$i.common[menu.text];
        menus.push(menu);
      }
    });
    vm.setMenuLink(menus);
    return menus;
  }
};
