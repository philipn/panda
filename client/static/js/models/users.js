PANDA.models.User = Backbone.Model.extend({
    /*
    Equivalent of django.contrib.auth.models.User.
    */
    urlRoot: PANDA.API + "/user",

    notifications: null,

    initialize: function(attributes) {
        if ("notifications" in attributes) {
            this.notifications = new PANDA.collections.Notifications(attributes.notifications);
        } else {
            this.notifications = new PANDA.collections.Notifications();
        }
    },

    refresh_notifications: function(success_callback, error_callback) {
        /*
         * Refresh notifications list from the server.
         */
        this.notifications.fetch({
            data: "read_at__isnull=True",
            success: _.bind(function(response) {
                if (success_callback) {
                    success_callback(this);
                }
            }, this),
            error: function(xhr, textStatus) {
                error = JSON.parse(xhr.responseText);

                if (error_callback) {
                    error_callback(this, error);
                }
            }
        });
    },

    mark_notifications_read: function(success_callback) {
        /*
         * Mark all notifications as read.
         *
         * TODO: bulk update
         */
        var now = moment().format("YYYY-MM-DDTHH:mm:ss");

        this.notifications.each(function(note) {
            note.save({ read_at: now }, { async: false });
        });

        this.notifications.reset();
        success_callback();
    }
});

PANDA.collections.Users = Backbone.Collection.extend({
    /*
    A collection of django.contrib.auth.models.User equivalents.
    */
    model: PANDA.models.User,
    urlRoot: PANDA.API + "/user"
});

