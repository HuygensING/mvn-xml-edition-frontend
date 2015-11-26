(function() {
	define(['backbone', 'app/config', 'app/collections/views'], function(Backbone, config, currentViews) {
		var ViewManager, selfDestruct;

		selfDestruct = function(view) {
			if (!currentViews.has(view)) {
				console.log("Unknown view!", view);
				return false;
			}
			if (view.destroy) {
				return view.destroy();
			} else {
				return view.remove();
			}
		};
		ViewManager = (function() {
			function ViewManager(el) {
				this.main = $(el);
				this.debugCurrentViews = currentViews;
			}

			ViewManager.prototype.clear = function(view) {
				if (view) {
					selfDestruct(view);
					return currentViews.remove(view.cid);
				} else {
					currentViews.each(function(v) {
						return selfDestruct(v.get('view'));
					});
					return currentViews.reset();
				}
			};

			ViewManager.prototype.register = function(view) {
				if (view) {
					return currentViews.add({
						id: view.cid,
						view: view
					});
				}
			};

			ViewManager.prototype.show = function(view) {
				if (!view) {
					return this.main.html('');
				} else {
					return this.main.html(view.$el);
				}
			};

			return ViewManager;

		})();
		return new ViewManager(config.viewManagerRoot);
	});
}).call(this);