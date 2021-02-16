const { calculateIndexData } = Utils;
let labelColors;
Meteor.startup(() => {
  labelColors = Boards.simpleSchema()._schema['labels.$.color'].allowedValues;
});

BlazeComponent.extendComponent({
  onCreated() {
    this.currentColor = new ReactiveVar(this.data().color);
  },

  labels() {
    return labelColors.map(color => ({ color, name: '' }));
  },

  isSelected(color) {
    return this.currentColor.get() === color;
  },

  events() {
    return [
      {
        'click .js-palette-color'() {
          this.currentColor.set(this.currentData().color);
        },
      },
    ];
  },
}).register('formLabel');

BlazeComponent.extendComponent({
  onRendered() {
    const $subtasksDom = this.$('.edit-labels-pop-over');

    $subtasksDom.sortable({
      tolerance: 'pointer',
      helper: 'clone',
      handle: '.card-label',
      items: '.js-label-item',
      placeholder: 'labels placeholder',
      distance: 7,
      start(evt, ui) {
        ui.placeholder.height(ui.helper.height());
        // EscapeActions.executeUpTo('popup-close');        
      },
      stop(evt, ui) {
        let prevChecklist = ui.item.prev('.js-label-item').get(0);
        if (prevChecklist) {
          prevChecklist = Blaze.getData(prevChecklist).label;
        }
        let nextChecklist = ui.item.next('.js-label-item').get(0);
        if (nextChecklist) {
          nextChecklist = Blaze.getData(nextChecklist).label;
        }
        const sortIndex = calculateIndexData(prevChecklist, nextChecklist, 1);

        $subtasksDom.sortable('cancel');
        const label = Blaze.getData(ui.item.get(0)).label;
        
        /*
        console.log('Stopped works here') //test

        Cards.update(label._id, {
          $set: {
            labelSort: sortIndex.base,
          },
        });
        */
      },
    });
  },

}).register('cardLabelsPopup');

Template.createLabelPopup.helpers({
  // This is the default color for a new label. We search the first color that
  // is not already used in the board (although it's not a problem if two
  // labels have the same color).
  defaultColor() {
    const labels = Boards.findOne(Session.get('currentBoard')).labels;
    const usedColors = _.pluck(labels, 'color');
    const availableColors = _.difference(labelColors, usedColors);
    return availableColors.length > 1 ? availableColors[0] : labelColors[0];
  },
});

Template.cardLabelsPopup.events({
  'click .js-select-label'(event) {
    const card = Cards.findOne(Session.get('currentCard'));
    const labelId = this._id;
    card.toggleLabel(labelId);
    event.preventDefault();
  },
  'click .js-edit-label': Popup.open('editLabel'),
  'click .js-add-label': Popup.open('createLabel'),
});

Template.formLabel.events({
  'click .js-palette-color'(event) {
    const $this = $(event.currentTarget);

    // hide selected ll colors
    $('.js-palette-select').addClass('hide');

    // show select color
    $this.find('.js-palette-select').removeClass('hide');
  },
});

Template.createLabelPopup.events({
  // Create the new label
  'submit .create-label'(event, templateInstance) {
    event.preventDefault();
    const board = Boards.findOne(Session.get('currentBoard'));
    const name = templateInstance
      .$('#labelName')
      .val()
      .trim();
    const color = Blaze.getData(templateInstance.find('.fa-check')).color;
    board.addLabel(name, color);
    Popup.back();
  },
});

Template.editLabelPopup.events({
  'click .js-delete-label': Popup.afterConfirm('deleteLabel', function() {
    const board = Boards.findOne(Session.get('currentBoard'));
    board.removeLabel(this._id);
    Popup.back(2);
  }),
  'submit .edit-label'(event, templateInstance) {
    event.preventDefault();
    const board = Boards.findOne(Session.get('currentBoard'));
    const name = templateInstance
      .$('#labelName')
      .val()
      .trim();
    const color = Blaze.getData(templateInstance.find('.fa-check')).color;
    board.editLabel(this._id, name, color);
    Popup.back();
  },
});

Template.cardLabelsPopup.helpers({
  isLabelSelected(cardId) {
    return _.contains(Cards.findOne(cardId).labelIds, this._id);
  },
});
