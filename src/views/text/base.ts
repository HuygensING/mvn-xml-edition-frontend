export const BaseText = {
	renderAnnotations: function () {
		let overlap = false
		let prev_bottom = 0

		this.$('.noteright').each(function (i, note) {
			note = $(note)
			const top = note.offset().top
			const height = note.outerHeight()

			if (top < prev_bottom) {
				if (!overlap) {
					overlap = true;
					note.css('margin-left', '160px');
				} else {
					overlap = false;
					note.css('margin-left', '0px');
				}
			} else if (overlap) {
				overlap = false
			}

			prev_bottom = top + height;
		});
	}
}
