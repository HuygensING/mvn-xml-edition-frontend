(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone'], function(Backbone) {
    var Collection, _ref;

    Collection = (function(_super) {
      __extends(Collection, _super);

      function Collection() {
        _ref = Collection.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Collection.prototype.has = function(view) {
        if (this.get(view.cid)) {
          return true;
        } else {
          return false;
        }
      };

      return Collection;

    })(Backbone.Collection);
    return new Collection();
  });

}).call(this);