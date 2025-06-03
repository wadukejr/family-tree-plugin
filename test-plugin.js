Draw.loadPlugin(function(ui) {
  console.log('✅ Test plugin is running');

  ui.actions.addAction('sayHello', function() {
    mxUtils.alert('Hello from plugin!');
  });

  ui.menus.get('extras').funct = function(menu, parent) {
    ui.menus.addMenuItem(menu, 'sayHello', parent);
  };
});
