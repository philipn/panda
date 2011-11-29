PANDA.views.DatasetsResults = Backbone.View.extend({
    template: PANDA.templates.datasets_results,
    pager_template: PANDA.templates.pager,
    view_template: PANDA.templates.dataset_view,

    initialize: function(options) {
        _.bindAll(this, "render", "dataset_link");

        this.search = options.search;
        this.search.datasets.bind("reset", this.render);

        $("#dataset-view-modal").modal({
            backdrop: true,
            keyboard: true
        });

        $(".dataset-link").live("click", this.dataset_link);
    },

    render: function() {
        context = this.search.datasets.meta;
        context["settings"] = PANDA.settings;

        context["query"] = this.search.query;
        context["category"] = this.search.category;
        context["root_url"] = "#datasets";

        context["pager"] = this.pager_template(context);
        context["datasets"] = this.search.datasets.results()["datasets"];

        this.el.html(this.template(context));
    },

    dataset_link: function(e) {
        dataset_uri = $(e.currentTarget).attr("data-uri");
        dataset = this.search.datasets.get(dataset_uri);

        // Update dataset with complete attributes
        dataset.fetch({ success: _.bind(function(model, response) {
            $("#dataset-view-modal .modal-body").html(this.view_template(model.toJSON(true)));

            $("#dataset-view-modal form .actions").remove();

            $("#dataset-view-modal .modal-footer").empty();
            $("#dataset-view-modal .modal-footer").append('<input type="button" class="btn modal-close" value="Close" />');
            $("#dataset-view-modal .modal-footer").append('<a href="#dataset/' + model.get("id") + '" class="btn modal-close">Goto dataset</a>');

            $("#dataset-view-modal").modal("show");
        }, this) });

        return false;
    }
});

