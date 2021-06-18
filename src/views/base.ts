// (function() {
// 	const __hasProp = {}.hasOwnProperty,
// 		__extends = function(child, parent) { for (const key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

// 	define(['underscore', 'backbone', 'app/views/manager'], function(_, Backbone, viewManager) {
// 		const BaseView, _ref;

// 		return BaseView = (function(_super) {
// 			__extends(BaseView, _super);

// 			function BaseView() {
// 				_ref = BaseView.__super__.constructor.apply(this, arguments);
// 				return _ref;
// 			}

// 			BaseView.prototype.defaults = function() {
// 				return {
// 					managed: true
// 				};
// 			};

// 			BaseView.prototype.initialize = function() {
// 				this.options = _.extend(this.defaults(), this.options);
// 				if (this.options.managed) {
// 					return viewManager.register(this);
// 				}
// 			};

// 			return BaseView;

// 		})(Backbone.View);
// 	});

// }).call(this);

// export const BaseView = Backbone.View.extend({
// 	defaults: function() {
// 		return {
// 			managed: true
// 		}
// 	},

// 	initialize: function(options) {
// 		this.options = _.extend(this.defaults(), this.options);
// 		if (this.options.managed) {
// 			return viewManager.register(this);
// 		}
// 	}
// }
