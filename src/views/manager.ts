// (function() {
// 	define(['backbone', 'app/config', 'app/collections/views'], function(Backbone, config, currentViews) {
// 		const ViewManager, selfDestruct;

import Backbone from 'backbone'
import { config } from '../config'
// import $ from'jquery'

class ViewManager {
	main = $(config.viewManagerRoot);
	currentViews = new Backbone.Collection()

	clear(view?: Backbone.View) {
		if (view == null) {
			this.currentViews.each(function(v) {
				v.get('view').remove()
			})

			this.currentViews.reset()
		} else {
			view.remove()
			this.currentViews.remove(view.cid)
		}
	}

	register(view: Backbone.View) {
		if (view == null) return

		this.currentViews.add({
			id: view.cid,
			view: view
		})
	}

	show(view: Backbone.View) {
		if (!view) {
			this.main.html('');
		} else {
			// TODO fix
			// @ts-ignore
			this.main.html(view.$el);
		}
	}
}

export const viewManager = new ViewManager()
