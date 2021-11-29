export const BaseBrowser = {
	renderCloseButton: function() {
		$('<div>')
			.addClass('close')
			.html(
				`<svg viewbox="0 0 40 40">
					<path class="close-x" d="M 10,10 L 30,30 M 30,10 L 10,30" />
				</svg>`
			)
			.appendTo(this.$el)
	}
}
