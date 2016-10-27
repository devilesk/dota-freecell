"use strict";

var _;

(function() {
    _ = GameUI.CustomUIConfig().UtilLibrary;

    function Card(options) {
        //$.Msg("Card constructor", options.rank, options.suit);
        var self = this;
        this._rank = options.rank;
        this._suit = options.suit;
        this._faceUp = options.faceUp || false;
        options.layoutfile = options.layoutfile || "file://{resources}/layout/custom_game/cards/card.xml";
        _.Panel.call(this, options);
        if (this.panel) {
            this.panel.SetHasClass("card-" + this._rank + this._suit, this._faceUp);
            this.panel.SetHasClass("card-back", !this._faceUp);
        }
    }
    _.inherits(Card, _.Panel);
    Card.prototype.value = function() {
        return this._rank + this._suit;
    }
    Card.prototype.suitColor = function() {
        return (this._suit == "c" || this._suit == "s") ? "black" : "red";
    }
    Card.prototype.rank = function(value) {
        if (value == undefined) return this._rank;
        if (this.panel) this.panel.SetHasClass("card-" + this._rank + this._suit, false);
        this._rank = value;
        if (this.panel) this.panel.SetHasClass("card-" + this._rank + this._suit, true);
    }
    Card.prototype.suit = function(value) {
        if (value == undefined) return this._suit;
        if (this.panel) this.panel.SetHasClass("card-" + this._rank + this._suit, false);
        this._suit = value;
        if (this.panel) this.panel.SetHasClass("card-" + this._rank + this._suit, true);
    }
    Card.prototype.faceUp = function(value) {
        if (value == undefined) return this._faceUp;
        this._faceUp = value;
        if (this.panel) {
            this.panel.SetHasClass("card-" + this._rank + this._suit, this._faceUp);
            this.panel.SetHasClass("card-back", !this._faceUp);
            this.panel.style.z = "0px";
            this.panel.style["z-index"] = this._zIndex;

            this.panel.SetHasClass("card-flip-y", true);
            var self = this;
            $.Schedule(0.2, function() {
                self.panel.SetHasClass("card-animate", false);
                self.panel.SetHasClass("card-flip-y", false);
                self.panel.SetHasClass("card-animate", true);
            });
        }
    }
    Card.prototype.render = function() {
        if (this.panel) {
            //$.Msg('card render', this.style, this.value());
            this.panel.style.x = this.style.x() + this.style.x.suffix;
            this.panel.style.y = this.style.y() + this.style.y.suffix;
            this.panel.style.zIndex = this.style.zIndex();
            this.panel.visible = this.visible();
            this.panel.SetDraggable(this.draggable());
        }
    }
    Card.prototype.OnMouseOver = function() {
        // highlight this panel as a drop target
        if (this.panel) this.panel.AddClass("highlight");
    }
    Card.prototype.OnMouseOut = function() {
        // highlight this panel as a drop target
        if (this.panel) this.panel.RemoveClass("highlight");
    }
    Card.prototype.OnDragEnter = function(a, draggedPanel) {
        //$.Msg("Card OnDragEnter");
        // highlight this panel as a drop target
        if (this.droppable() && this.panel) this.panel.AddClass("potential_drop_target");
    }
    Card.prototype.OnDragLeave = function(panelId, draggedPanel, card) {
        // un-highlight this panel
        if (this.panel) this.panel.RemoveClass("potential_drop_target");
    }
    Card.prototype.OnDragStart = function(panelId, dragCallbacks, card) {
        if (!this.draggable() || !this.panel) return;
        this.draggable(false);

        // create a temp panel that will be dragged around
        var displayPanel = $.CreatePanel("Panel", this.panel, "dragImage");
        displayPanel.BLoadLayout("file://{resources}/layout/custom_game/cards/card.xml", false, false);
        displayPanel.SetHasClass("card-" + this.rank() + this.suit(), this.faceUp());
        displayPanel.SetHasClass("card-back", !this.faceUp());

        displayPanel.card = this; // whether the drag was successful

        // hook up the display panel, and specify the panel offset from the cursor
        dragCallbacks.displayPanel = displayPanel;
        dragCallbacks.offsetX = 50;
        dragCallbacks.offsetY = 50;

        // grey out the source panel while dragging
        this.panel.AddClass("dragging_from");
    }
    Card.prototype.OnDragEnd = function(panelId, draggedPanel, card) {
        //$.Msg("Card OnDragEnd");
        // kill the display panel
        draggedPanel.DeleteAsync(0);

        this.draggable(true);

        // restore our look
        this.panel.RemoveClass("dragging_from");
    }

    function CardCollection(options) {
        //$.Msg("CardCollection constructor");
        this._cardOffset = options.cardOffset || {
            x: 0,
            y: 30
        };
        options.rank = "slot";
        options.suit = "test";
        var self = _.PanelCollection.call(this, options);
        //$.Msg("CardCollection constructor", self.panel.paneltype);
        options.panel = self.panel;
        self.slot = new Card(options);
        Object.setPrototypeOf(self, Object.getPrototypeOf(this));
        self.updateStyles(options.style);
        for (var event in self.slot._handlers) {
            self.slot.unregisterHandler(event);
            self.slot.registerHandler(event, self.fireEvent.bind(self, event));
        }
        self.slot.render();
        return self;
    }
    _.inherits(CardCollection, _.PanelCollection);
    CardCollection.prototype.OnDragEnter = function(a, draggedPanel) {
        this.slot.OnDragEnter.apply(this.slot, arguments);
    }
    CardCollection.prototype.OnDragLeave = function(a, draggedPanel) {
        this.slot.OnDragLeave.apply(this.slot, arguments);
    }
    CardCollection.prototype.cardOffset = function(value) {
        if (value == undefined) return this._cardOffset;
        this._cardOffset = value;
        this.render();
    }
    CardCollection.prototype.last = function() {
        if (this.length) {
            return this[this.length - 1];
        }
        return null;
    }
    CardCollection.prototype.render = function() {
        var self = this;
        this.slot.render();
        this.forEach(function(card, i) {
            card.style.zIndex(self.style.zIndex() + i + 1);
            card.style.x(self.style.x() + self.cardOffset().x * i);
            card.style.y(self.style.y() + self.cardOffset().y * i);
            card.visible(self.visible() && card.visible());
        });
    };

    function Pile(options) {
        _.Mixable.call(this);
        var self = this;
        this.items = new _.Collection();
        this.cardOffsetX = _.observable(options.cardOffsetX || 0);
        this.cardOffsetX.subscribe(function() {
            self.render()
        });
        this.cardOffsetY = _.observable(options.cardOffsetY || 0);
        this.cardOffsetY.subscribe(function() {
            self.render()
        });
        if (options.slot) {
            this.slot = new Card(options.slot);
            for (var event in this.slot._handlers) {
                this.slot.unregisterHandler(event);
                this.slot.registerHandler(event, this.fireEvent.bind(this, event));
            }
        }
    }
    _.inherits(Pile, _.Mixable);
    _.mixin(Pile, _.mixInEvents);
    _.mixin(Pile, _.mixInHandlers);
    _.extend(Pile.prototype, {
        get: function(i) {
            return this.items.get(i);
        },
        isEmpty: function() {
            return this.items.isEmpty();
        },
        length: function() {
            return this.items.length();
        },
        last: function() {
            return this.items.last();
        },
        OnDragEnter: function(a, draggedPanel) {
            this.slot.OnDragEnter.apply(this.slot, arguments);
        },
        OnDragLeave: function(a, draggedPanel) {
            this.slot.OnDragLeave.apply(this.slot, arguments);
        },
        render: function() {
            var self = this;
            if (this.slot) this.slot.render();
            this.items.forEach(function(card, i) {
                card.style.zIndex(self.slot.style.zIndex() + i + 1);
                card.style.x(self.slot.style.x() + self.cardOffsetX() * i);
                card.style.y(self.slot.style.y() + self.cardOffsetY() * i);
                card.visible(self.slot.visible() && card.visible());
            });
        }
    });

    function Deck(options) {
        //$.Msg("CardLibrary CreateDeck", options);
        this.cards = {};

        var options = _.extend({
            ctor: Card,
            parentPanel: $.GetContextPanel()
        }, options);
        options.parentPanel.RemoveAndDeleteChildren();
        for (var i = 0; i < 52; i++) {
            var rank = "a23456789tjqk".charAt(Math.floor(i / 4));
            var suit = "cdhs".charAt(i % 4);
            var cardOptions = _.extend({
                rank: rank,
                suit: suit,
                style: {
                    x: i * 30,
                    y: 0,
                    zIndex: i
                }
            }, options);
            var card = new options.ctor(cardOptions);
            this.cards[rank + suit] = card;
        }
    }

    GameUI.CustomUIConfig().CardLibrary = {
        contextPanel: $.GetContextPanel(),
        Deck: Deck,
        Pile: Pile,
        Card: Card,
        CardCollection: CardCollection
    };

    $.Msg("cards/table.js");
})();