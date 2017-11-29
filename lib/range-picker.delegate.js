module.exports = () => {

	function pickerDelegate() {
		this.pickers = [];
		this.hideAll = () => {
			this.pickers.forEach((picker) => picker.hide());
		};
		this.hideAllExcept = (name) => {
			this.pickers.filter((p) => p.name === name || p === name ? false : true).forEach((picker) => picker.hide());
		};
		this.hide = (name) => {
			this.pickers.filter((p) => p.name === name || p === name).forEach((p) => p.hide());
		};
		this.show = (name) => {
			this.pickers.filter((p) => p.name === name || p === name).forEach((p) => p.show());
		};
		this.add = (picker) => {
			if (this.pickers.indexOf(picker) < 0) {
				this.pickers.push(picker);
			}
		};
		this.remove = (picker) => {
			const index = this.pickers.indexOf(picker);
			if (index >= 0) {
				this.pickers.splice(index, 1);
			}
		};

		return this;
	}

	return new pickerDelegate();
};