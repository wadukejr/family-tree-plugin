Draw.loadPlugin(function(ui) {
  const graph = ui.editor.graph;

  function createNode(graph, parent, name, title, x, y, width = 140, height = 60) {
    const htmlValue = `<h4><font face="Times New Roman">${name}<br></font><font face="Times New Roman"><i style="font-weight: normal;">${title}</i></font></h4>`;
    return graph.insertVertex(parent, null, htmlValue, x, y, width, height, 'rounded=0;whiteSpace=wrap;html=1;');
  }

  function insertSampleTree() {
    const parent = graph.getDefaultParent();
    graph.getModel().beginUpdate();
    try {
      createNode(graph, parent, 'John Smith', 'Paternal Grandfather', 100, 30);
      createNode(graph, parent, 'Mary Smith', 'Paternal Grandmother', 300, 30);
      createNode(graph, parent, 'William Smith', 'Father', 200, 130);
      createNode(graph, parent, 'Jane Smith', 'Decedent', 200, 230);
    } finally {
      graph.getModel().endUpdate();
    }
  }

  function importFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.txt';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const lines = reader.result.trim().split('\n');
        if (lines.length < 2) {
          alert('File must have at least one data row.');
          return;
        }

        const header = lines[0].split(',').map(h => h.trim().toLowerCase());
        const levelIdx = header.indexOf('level');
        const nameIdx = header.indexOf('name');
        const relationIdx = header.indexOf('relationship to decedent');

        if (levelIdx === -1 || nameIdx === -1 || relationIdx === -1) {
          alert('Headers must include: Level, Name, Relationship to Decedent');
          return;
        }

        const parent = graph.getDefaultParent();
        graph.getModel().beginUpdate();
        try {
          const spacingX = 180;
          const spacingY = 100;
          const levelCounts = {};
          lines.slice(1).forEach((line) => {
            const parts = line.split(',').map(p => p.trim());
            const level = parseInt(parts[levelIdx], 10);
            const name = parts[nameIdx];
            const rel = parts[relationIdx];

            if (isNaN(level)) return;

            levelCounts[level] = (levelCounts[level] || 0) + 1;
            const col = levelCounts[level] - 1;

            const x = 50 + col * spacingX;
            const y = 30 + level * spacingY;

            createNode(graph, parent, name, rel, x, y);
          });
        } finally {
          graph.getModel().endUpdate();
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  // Add menu items
  ui.menus.get('extras').funct = function(menu, parent) {
    ui.menus.addMenuItem(menu, 'insertSampleTree', parent);
    ui.menus.addMenuItem(menu, 'importTreeFromFile', parent);
  };

  ui.actions.addAction('insertSampleTree', insertSampleTree);
  ui.actions.addAction('importTreeFromFile', importFromFile);
});
