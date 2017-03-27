const EditCardEstimate = BlazeComponent.extendComponent({
  template() {
    return 'editCardEstimate';
  },

  onCreated() {
    const self = this;
    self.error = new ReactiveVar('');
    self.card = self.data();
    self.estimate = ReactiveVar();
  },

  showEstimate() {
    return this.estimate;
  },

  events() {
    return [{
      'submit .edit-estimate'(evt) {
        evt.preventDefault();

        let estimate = evt.target.estimate.value;
        if (estimate && estimate >= 0) {
          this._storeEstimate(estimate);
          Popup.close();
        }
        else {
          this.error.set('invalid-value');
          evt.target.estimate.focus();
        }
      },
      'click .js-delete-estimate'(evt) {
        evt.preventDefault();
        this._deleteEstimate();
        Popup.close();
      },
    }];
  },
});

// editCardEsimatePopup
(class extends EditCardEstimate {
  onCreated() {
    super.onCreated();
    if (this.data().estimate) {
      this.estimate.set(this.data().estimate);
    }
  }

  _storeEstimate(estimate) {
    this.card.setEstimate(estimate);
  }

  _deleteEstimate() {
    this.card.unsetEstimate();
  }
}).register('editCardEsimatePopup');

// Display card estimate
const CardEstimate = BlazeComponent.extendComponent({
  template() {
    return 'estimateBadge';
  },

  onCreated() {
    const self = this;
    self.estimate = ReactiveVar();
    self.autorun(() => {
      self.estimate.set(self.data().estimate);
    });
  },

  showEstimate() {
    return this.estimate.get();
  },

  showTitle() {
    return `${TAPi18n.__('editCardEstimate-title')}`;
  },

  events() {
    return [{
      'click .js-edit-estimate': Popup.open('editCardEstimate'),
    }];
  },
}).register('cardEstimate');
