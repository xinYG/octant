
export abstract class BaseShape {
  protected constructor(public id: string) {
  }

  toNode(shapes: BaseShape[]) {}
}

export class Edge extends BaseShape {
  classes: string;

  constructor( id: string,
                        public sourceId: string,
                        public targetId: string) {
    super(id);
  }

  toNode(shapes: BaseShape[]) {
    return {
      data: {
        id: this.id,
        source: this.sourceId,
        target: this.targetId,
      },
      group: 'edges',
      removed: false,
      selected: false,
      selectable: true,
      locked: false,
      grabbable: true,
      pannable: false,
      classes: this.classes
    }
  }

}

export abstract class Shape extends BaseShape {
  x: number;
  y: number;
  classes: string;

  element: any;

  constructor(id: string,
              public label: string,
              public width: any,
              public height: any,
              public shape: string,
              public hasChildren: boolean,
              public parentId?: string) {
    super(id);
  }

  abstract preferredPosition(): {x: number, y: number};

  portPosition(): number {
    return(this.preferredPosition().y);
  }

  getPosition(shapes: BaseShape[]): {x: number, y: number}{
    return this.preferredPosition();
  }

  getPortPosition(shapes: Shape[], port: Port): {x: number, y: number}{
    const textWidth= this.getTextWidth(port.label) + 10;
    const {x, y} = this.getPosition(shapes);
    const portY= this.portPosition();

    switch (port.location) {
      default:
      case 'left':
        return {x: x - this.width / 2 + textWidth / 2, y: portY}
      case 'right':
        return {x: x + this.width / 2 - textWidth / 2, y: portY}
    }
  }

  isMovable():boolean {
    return this.parentId == undefined;
  }

  getTextWidth(txt){
    const fontName= 'Metropolis';
    const fontSize= 14;
//    this.cytoscape.nodes('#glyph20')[0]._private.rstyle.labelWidth

    if(!this.element){
      this.element = document.createElement('span');
      document.body.appendChild(this.element);
    }
    if(this.element.style.fontSize != fontSize)
      this.element.style.fontSize = fontSize;
    if(this.element.style.fontFamily != fontName)
      this.element.style.fontFamily = fontName;
    this.element.innerText = txt;
    return this.element.offsetWidth;
  }

  toNode(shapes: BaseShape[]) {
    return {
      data: {
        id: this.id,
        label: this.label,
        owner: this.parentId,
        width: this.width,
        height: this.height,
        x: this.getPosition(shapes).x,
        y: this.getPosition(shapes).y,
        hasChildren: this.hasChildren,
        shape: this.shape,
      },
      group: 'nodes',
      removed: false,
      selected: false,
      selectable: this.isMovable(),
      locked: false,
      grabbable: this.isMovable(),
      pannable: false,
      classes: this.classes
    }
  }
}

export class Deployment extends Shape {
  constructor(id: string, label: string, hasChildren: boolean, parentId?: string) {
    super(id, label, 800, 600, 'rectangle', hasChildren, parentId);
    this.classes= 'deployment';
  }

  preferredPosition(): {x: number, y: number} {
    return{x: 750, y: 450}
  };

  portPosition(): number {
    return(this.preferredPosition().y/2);
  }

}

export class Secret extends Shape {
  constructor(id: string, label: string, hasChildren: boolean, parentId?: string) {
    super(id, label, 350, 200, 'roundrectangle', hasChildren, parentId);
    this.classes= 'secret';
  }

  preferredPosition(): {x: number, y: number} {
    return{x: 100, y: 1000}
  };
}

export class ServiceAccount extends Shape {
  constructor(id: string, label: string, hasChildren: boolean, parentId?: string) {
    super(id, label, 350, 200, 'roundrectangle', hasChildren, parentId);
    this.classes= 'secret';
  }

  preferredPosition(): {x: number, y: number} {
    return{x: 600, y: 1000}
  };
}

export class Service extends Shape {
  constructor(id: string, label: string, hasChildren: boolean, parentId?: string) {
    super(id, label, 350, 200, 'roundrectangle', hasChildren, parentId);
    this.classes= 'secret';
  }

  preferredPosition(): {x: number, y: number} {
    return{x: 0, y: 400}
  };
}

export class ReplicaSet extends Shape {
  constructor(id: string, label: string, hasChildren: boolean, parentId?: string) {
    super(id, label, 600, 400, 'rectangle', hasChildren, parentId);
    this.classes= 'replicaset';
  }

  preferredPosition(): {x: number, y: number} {
    return{x: 800, y: 500}
  };
}

export class Pod extends Shape {
  constructor(id: string, label: string, hasChildren: boolean, parentId?: string) {
    super(id, label, 350, 200, 'roundrectangle', hasChildren, parentId);
    this.classes= 'pod';
  }

  preferredPosition(): {x: number, y: number} {
    return{x: 875, y: 525}
  };
}

export class Port extends Shape {
  constructor(id: string, label: string, public location: string, className: string, parentId?: string) {
    super(id, label, 'label', 'label', 'rectangle', false, parentId);
    this.classes= className;
  }

  isMovable():boolean {
    return false;
  }

  preferredPosition(): {x: number, y: number} {
    return{x: 750, y: 450}
  };

  getPosition(shapes: Shape[]): {x: number, y: number} {
    const parentNode: Shape= shapes.find( (shape: Shape) => shape.id===this.parentId);
    const portPosition = parentNode.getPortPosition(shapes, this);
    return portPosition;
  };
}
