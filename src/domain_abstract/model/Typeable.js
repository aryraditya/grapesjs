const Model = Backbone.Model;
const View = Backbone.View;

export default {

  initialize(models, opts) {
    this.model = (attrs, options) => {
      let modelType = this.getType(attrs.type);
      const baseType = this.getBaseType();
      const Model = modelType ? modelType.model : baseType.model;
      return new Model(attrs, options);
    };
    const init = this.init;
    init && init();
  },

  /**
   * Returns the base type (last object in the stack)
   * @return {Object}
   */
  getBaseType() {
    const types = this.getTypes();
    return types[types.length - 1];
  },

  /**
   * Get types
   * @return {Array}
   */
  getTypes() {
    return [];
  },

  /**
   * Get type
   * @param {string} id Type ID
   *
   */
  getType(id) {
    const types = this.getTypes();

    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      if (type.id === id) {
        return type;
      }
    }
  },

  /**
   * Add new type
   * @param {string} id Type ID
   * @param {Object} definition Definition of the type. Each definition contains
   *                            `model` (business logic), `view` (presentation logic)
   *                            and `isType` function which recognize the type of the
   *                            passed entity
   * addType('my-type', {
   *  model: {},
   *  view: {},
   *  isType: (value) => {},
   * })
   */
  addType(id, definition) {
    const type = this.getType(id);
    let {model, view, isType} = definition;
    model = model instanceof Model ? model : Model.extend(model);
    view = view instanceof View ? view : View.extend(view);

    if (type) {
      type.model = model;
      type.view = view;
      type.isType = isType || type.isType;
    } else {
      definition.id = id;
      definition.model = model;
      definition.view = view;
      this.getTypes().unshift(definition);
    }
  }
}