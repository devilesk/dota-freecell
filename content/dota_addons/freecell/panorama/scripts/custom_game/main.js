"use strict";

var _;
var CardLibrary;
var DialogLibrary;
var fc;

function OnUndo() {
    fc.undo();
}

function OnNewGame() {
    var num = _.getRandomInt(1, 32000);
    StartGame(num);
}

function StartGame(num) {
    Game.EmitSound("Card.cardOpenPackage2");
    fc.deal(num);
    $('#game-number-label').text = $.Localize("game_number_label") + num;
}

function OnPlayAgain() {
    var dialog = new DialogLibrary.Dialog({
        parentPanel: DialogLibrary.contextPanel,
        layoutfile: "file://{resources}/layout/custom_game/dialog/dialog.xml",
        id: "dialog-container",
        hittest: true,
        children: [{
            id: "contents-container",
            cssClasses: ["contents-container"],
            style: {
                width: 400
            },
            children: [{
                cssClasses: ["control", "horizontal-center"],
                id: "control-1",
                children: [{
                    id: "label-1",
                    panelType: "Label",
                    text: $.Localize("victory_text")
                }]
            }, {
                cssClasses: ["control", "horizontal-center"],
                id: "control-2",
                children: [{
                    events: {
                        OnActivate: function() {
                            OnNewGame();
                            this.root.close();
                        },
                        OnTabForward: function() {
                            this.root.focusNextInput(this);
                        }
                    },
                    panelType: "Button",
                    init: function() {
                        this.root.controls.push(this);
                    },
                    cssClasses: ["btn"],
                    children: [{
                        panelType: "Label",
                        text: $.Localize("play_again"),
                        skipBindHandlers: true
                    }]
                }]
            }]
        }]
    });
}

function OnLose() {
    var dialog = new DialogLibrary.Dialog({
        parentPanel: DialogLibrary.contextPanel,
        layoutfile: "file://{resources}/layout/custom_game/dialog/dialog.xml",
        id: "dialog-container",
        hittest: true,
        children: [{
            id: "contents-container",
            cssClasses: ["contents-container"],
            style: {
                width: 400
            },
            children: [{
                cssClasses: ["control", "horizontal-center"],
                id: "control-1",
                children: [{
                    id: "label-1",
                    panelType: "Label",
                    text: $.Localize("defeat_text")
                }]
            }, {
                cssClasses: ["control"],
                id: "control-2",
                children: [{
                    events: {
                        OnActivate: function() {
                            OnUndo();
                            this.root.close();
                        },
                        OnTabForward: function() {
                            this.root.focusNextInput(this);
                        }
                    },
                    panelType: "Button",
                    init: function() {
                        this.root.controls.push(this);
                    },
                    cssClasses: ["btn"],
                    children: [{
                        panelType: "Label",
                        text: $.Localize("undo"),
                        skipBindHandlers: true
                    }]
                }]
            }, {
                cssClasses: ["control", "horizontal-right"],
                id: "control-3",
                children: [{
                    events: {
                        OnActivate: function() {
                            OnNewGame();
                            this.root.close();
                        },
                        OnTabForward: function() {
                            this.root.focusNextInput(this);
                        }
                    },
                    panelType: "Button",
                    init: function() {
                        this.root.controls.push(this);
                    },
                    cssClasses: ["btn"],
                    children: [{
                        panelType: "Label",
                        text: $.Localize("play_again"),
                        skipBindHandlers: true
                    }]
                }]
            }]
        }]
    });

}

function OnSelectGame() {
    var dialog = new DialogLibrary.Dialog({
        parentPanel: DialogLibrary.contextPanel,
        layoutfile: "file://{resources}/layout/custom_game/dialog/dialog.xml",
        id: "dialog-container",
        hittest: true,
        children: [{
            id: "contents-container",
            cssClasses: ["contents-container"],
            style: {
                width: 400
            },
            children: [{
                cssClasses: ["control"],
                id: "control-1",
                children: [{
                    id: "label-1",
                    panelType: "Label",
                    text: $.Localize("select_game_label")
                }, {
                    events: {
                        OnInputSubmit: function() {
                            if (this.panel.text >= 1 && this.panel.text <= 32000) {
                                StartGame(this.panel.text);
                                this.root.close();
                            }
                        },
                        OnTabForward: function() {
                            this.root.focusNextInput(this);
                        }
                    },
                    id: "textInput",
                    panelType: "TextEntry",
                    init: function() {
                        this.root.controls.push(this);
                    }
                }]
            }, {
                cssClasses: ["control"],
                id: "control-2",
                children: [{
                    events: {
                        OnActivate: function() {
                            var num = this.root.children[0].children[0].children[1].panel.text;
                            if (num >= 1 && num <= 32000) {
                                StartGame(num);
                                this.root.close();
                            }
                        },
                        OnTabForward: function() {
                            this.root.focusNextInput(this);
                        }
                    },
                    panelType: "Button",
                    init: function() {
                        this.root.controls.push(this);
                    },
                    cssClasses: ["btn"],
                    children: [{
                        panelType: "Label",
                        text: $.Localize("ok"),
                        skipBindHandlers: true
                    }]
                }]
            }, {
                cssClasses: ["control"],
                id: "control-3",
                children: [{
                    events: {
                        OnActivate: function() {
                            this.root.panel.DeleteAsync(0);
                        },
                        OnTabForward: function() {
                            this.root.focusNextInput(this);
                        }
                    },
                    panelType: "Button",
                    init: function() {
                        this.root.controls.push(this);
                    },
                    cssClasses: ["btn"],
                    children: [{
                        panelType: "Label",
                        text: $.Localize("cancel"),
                        skipBindHandlers: true
                    }]
                }]
            }]
        }]
    });
}

(function() {
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_TIMEOFDAY, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_HEROES, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_FLYOUT_SCOREBOARD, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_PANEL, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_MINIMAP, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_PANEL, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_SHOP, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_MENU_BUTTONS, false);

    _ = GameUI.CustomUIConfig().UtilLibrary;
    DialogLibrary = GameUI.CustomUIConfig().DialogLibrary;
    CardLibrary = GameUI.CustomUIConfig().CardLibrary;

    function FreeCell() {
        this.seed = 0;
        this.columns = [];
        this.cells = [];
        this.foundations = [];
        this.history = [];
        this.aspectRatios = {
            AspectRatio16x10: {
                columns: [200, 160],
                cells: [100, 160],
                foundations: [940, 160]
            },
            AspectRatio16x9: {
                columns: [370, 160],
                cells: [180, 160],
                foundations: [1180, 160]
            },
            AspectRatio5x4: {
                columns: [60, 160],
                cells: [40, 140],
                foundations: [780, 140]
            },
            AspectRatio4x3: {
                columns: [100, 160],
                cells: [80, 140],
                foundations: [820, 140]
            }
        }
        this.currentAspectRatio = this.getAspectRatioClass();
    };
    _.extend(FreeCell.prototype, {
        init: function() {
            this.deck = new CardLibrary.Deck({
                fc: this,
                ctor: FreeCellCard,
                visible: true,
                faceUp: true,
                draggable: true,
                droppable: false
            });
            var parentPanel = CardLibrary.contextPanel;
            var aspectRatio
            aspectRatio = this.getAspectRatioClass();
            for (var i = 0; i < 8; i++) {
                this.columns.push(new Column({
                    fc: this,
                    type: "column",
                    cardOffsetY: 30,
                    slot: {
                        parentPanel: parentPanel,
                        style: {
                            x: this.getAspectRatioValues(aspectRatio, "columns", i),
                            y: 370,
                            zIndex: 0
                        },
                        visible: true,
                        draggable: false,
                        droppable: true
                    }
                }));
            }
            for (var i = 0; i < 4; i++) {
                aspectRatio = this.getAspectRatioClass();
                this.cells.push(new Column({
                    fc: this,
                    type: "cell",
                    cardOffsetY: 30,
                    slot: {
                        parentPanel: parentPanel,
                        style: {
                            x: this.getAspectRatioValues(aspectRatio, "cells", i),
                            y: 100,
                            zIndex: 0
                        },
                        visible: true,
                        draggable: false,
                        droppable: true
                    }
                }));
                aspectRatio = this.getAspectRatioClass();
                this.foundations.push(new Column({
                    fc: this,
                    type: "foundation",
                    slot: {
                        parentPanel: parentPanel,
                        style: {
                            x: this.getAspectRatioValues(aspectRatio, "foundations", i),
                            y: 100,
                            zIndex: 0
                        },
                        visible: true,
                        draggable: false,
                        droppable: true
                    }
                }));
            }
            this.setAspectRatio();
            $.Schedule(3, this.setAspectRatioSchedule.bind(this));
        },
        setAspectRatioSchedule: function() {
            var aspectRatioClass = this.getAspectRatioClass();
            if (this.currentAspectRatio != aspectRatioClass) {
                this.currentAspectRatio = aspectRatioClass;
                this.setAspectRatio();
            }
            $.Schedule(3, this.setAspectRatioSchedule.bind(this));
        },
        setAspectRatio: function() {
            var self = this;
            var aspectRatioClass = this.getAspectRatioClass();
            ["columns", "cells", "foundations"].forEach(function(c) {
                self[c].forEach(function(column, i) {
                    column.slot.style.x(self.getAspectRatioValues(aspectRatioClass, c, i));
                    column.render();
                });
            });
        },
        getAspectRatioClass: function() {
            var aspectRatioClasses = Object.keys(this.aspectRatios);
            for (var i = 0; i < aspectRatioClasses.length; i++) {
                var aspectRatioClass = aspectRatioClasses[i];
                if ($.GetContextPanel().GetParent().GetParent().GetParent().BHasClass(aspectRatioClass)) return aspectRatioClass;
            }

        },
        getAspectRatioValues: function(aspectRatioClass, column, index) {
            var aspectRatio = this.aspectRatios[aspectRatioClass][column];
            return aspectRatio[0] + aspectRatio[1] * index;
        },
        setSeed: function(seed) {
            this.seed = seed;
        },
        getSeed: function() {
            return this.seed;
        },
        rand: function() {
            this.setSeed((this.getSeed() * 214013 + 2531011) & 0x7FFFFFFF);
            return ((this.getSeed() >> 16) & 0x7fff);
        },
        maxRand: function(mymax) {
            return this.rand() % mymax;
        },
        shuffle: function(deck) {
            if (deck.length) {
                var i = deck.length;
                while (--i) {
                    var j = this.maxRand(i + 1);
                    var tmp = deck[i];
                    deck[i] = deck[j];
                    deck[j] = tmp;
                }
            }
            return deck;
        },
        deal: function(seed) {
            var deck = [];
            this.setSeed(seed);
            this.columns.concat(this.cells).concat(this.foundations).forEach(function(column) {
                column.items.length(0);
            });
            this.history.length = 0;
            for (var i = 0; i < 52; i++) {
                var rank = "a23456789tjqk".charAt(Math.floor(i / 4));
                var suit = "cdhs".charAt(i % 4);
                deck.push(rank + suit);
            }
            deck = this.shuffle(deck).reverse();
            for (var i = 0; i < deck.length; i++) {
                var card = this.deck.cards[deck[i]];
                card.draggable(true);
                this.columns[i % 8].add(card);
            }
            this.columns.forEach(function(column) {
                column.render();
            });
        },
        getMaxStackSize: function(toEmptyColumn) {
            var emptyCellCount = 1;
            var emptyColumnCount = 0;

            this.cells.forEach(function(cell) {
                if (cell.isEmpty()) emptyCellCount++;
            });
            this.columns.forEach(function(column) {
                if (column.isEmpty()) emptyColumnCount++;
            });
            if (toEmptyColumn) emptyColumnCount--;
            return emptyCellCount * Math.pow(2, emptyColumnCount);
        },
        getRankValue: function(card) {
            switch (card.rank()) {
                case 'a':
                    return 1;
                    break;
                case 't':
                    return 10;
                    break;
                case 'j':
                    return 11;
                    break;
                case 'q':
                    return 12;
                    break;
                case 'k':
                    return 13;
                    break;
                default:
                    return parseInt(card.rank());
                    break;
            }
        },
        isOrdered: function(cards) {
            for (var i = 0; i < cards.length - 1; i++) {
                var a = cards[i];
                var b = cards[i + 1];
                if (a.suitColor() == b.suitColor() || this.compareRank(b, a) != -1) {
                    return false;
                }
            }
            return true;
        },
        undo: function() {
            var action = this.history.pop();
            if (action) {
                var card = action.card
                card.container.moveStack(card, action.column, true);
                action.column.render();
                if (action.toFoundation) {
                    card.draggable(true);
                    this.undo();
                }
            }
        },
        defeatCheck: function() {
            var bValidMoveRemaining = false;
            var cellsandcolumns = this.columns.concat(this.cells);
            // check if empty cell or column
            for (var i = 0; i < cellsandcolumns.length; i++) {
                if (cellsandcolumns[i].isEmpty()) return true;
            }
            // check if valid move between stacks
            for (var i = 0; i < this.columns.length; i++) {
                var column = this.columns[i];
                for (var j = 0; j < column.length(); j++) {
                    var card = column.get(j);
                    for (var k = 0; k < this.columns.length; k++) {
                        if (k == i) continue;
                        var destCard = this.columns[k].last();
                        var stackSlice = column.getStack(card);
                        if (!this.isOrdered(stackSlice)) break;
                        if (card.isValidMove(card, destCard)) return true;
                    }
                };
            }
            // check if valid move to cell to stack
            for (var i = 0; i < this.cells.length; i++) {
                var card = this.cells[i].last();
                for (var j = 0; j < this.columns.length; j++) {
                    var destCard = this.columns[j].last();
                    if (card.isValidMove(card, destCard)) return true;
                };
            }
            // check if valid move to foundation
            for (var i = 0; i < cellsandcolumns.length; i++) {
                var column = cellsandcolumns[i];
                var card = column.last();
                for (var j = 0; j < this.foundations.length; j++) {
                    var foundationCard = this.foundations[j].last();
                    if (foundationCard &&
                        this.getRankValue(foundationCard) == this.getRankValue(card) - 1 &&
                        foundationCard.suit() == card.suit()) {
                        return true;
                    }
                }
            }
            OnLose();
        },
        victoryCheck: function() {
            for (var i = 0; i < this.foundations.length; i++) {
                var foundation = this.foundations[i];
                var foundationCard = foundation.last();
                if (!foundationCard || this.getRankValue(foundationCard) != 13) return false;
            }
            OnPlayAgain();
        },
        process: function() {
            var self = this;
            var repeat = false;
            this.columns.concat(this.cells).forEach(function(column, j) {
                if (!column.isEmpty()) {
                    var card = column.last();
                    var rankValue = self.getRankValue(card);
                    var destFoundation;
                    var isReady = 0;
                    for (var i = 0; i < self.foundations.length; i++) {
                        var foundation = self.foundations[i];
                        var foundationCard = foundation.last();
                        if ((rankValue == 1 && !foundationCard) ||
                            (rankValue == 2 && foundationCard && foundationCard.suit() == card.suit())) {
                            destFoundation = foundation;
                            isReady = 2;
                            break;
                        } else if (rankValue > 2 && foundationCard) {
                            if (self.getRankValue(foundationCard) == rankValue - 1 &&
                                foundationCard.suit() == card.suit()) {
                                destFoundation = foundation;
                            } else if (self.getRankValue(foundationCard) >= rankValue - 1 &&
                                foundationCard.suitColor() != card.suitColor()) {
                                isReady++;
                            }
                        }
                    }

                    if (destFoundation && isReady == 2) {
                        //$.Msg("process moving card ", card.value());
                        column.moveStack(card, destFoundation);
                        destFoundation.render();
                        repeat = true;
                    }
                }
            });
            if (repeat) {
                this.process();
            } else {
                this.victoryCheck();
                this.defeatCheck();
            }
        },
        compareRank: function(a, b) {
            return this.getRankValue(a) - this.getRankValue(b);
        },
        getColumn: function(i) {
            return this.columns[i];
        },
        getCell: function(i) {
            return this.cells[i];
        },
        getFoundation: function(i) {
            return this.foundations[i];
        }
    });

    function FreeCellCard(options) {
        this.fc = options.fc;
        CardLibrary.Card.call(this, options);
    }
    _.inherits(FreeCellCard, CardLibrary.Card);
    _.extend(FreeCellCard.prototype, {
        isValidMove: function(draggedCard, card) {
            var column = card.container;
            var columnDragged = draggedCard.container;
            var stackSlice = columnDragged.getStack(draggedCard);
            var maxStackSize = this.fc.getMaxStackSize();
            var columnType = column.type();
            if (columnType == "column" &&
                this.fc.isOrdered([card, draggedCard]) &&
                this.fc.isOrdered(stackSlice) &&
                stackSlice.length <= maxStackSize) {
                //$.Msg("valid move to column");
                return true;
            } else if (columnType == "foundation" &&
                draggedCard.suit() == card.suit() &&
                this.fc.compareRank(draggedCard, card) == 1 &&
                stackSlice.length == 1) {
                //$.Msg("valid move to foundation");
                return true;
            }
            //$.Msg("invalid move");
            return false;
        },
        OnDragEnter: function(a, draggedPanel, card) {
            //$.Msg("FreeCellCard Card OnDragEnter", draggedPanel, " ", card.value());
            var draggedCard = draggedPanel.card;
            card.droppable(this.isValidMove(draggedCard, card));
            CardLibrary.Card.prototype.OnDragEnter.apply(this, arguments);
        },
        OnDragDrop: function(panelId, draggedPanel, card) {
            //$.Msg("FreeCellCard Card OnDragDrop", panelId, " ", draggedPanel, " ", card.value());
            var column = card.container;
            var draggedCard = draggedPanel.card;
            var columnDragged = draggedCard.container;
            //if (columnDragged.type() == "foundation") return;
            if (this.isValidMove(draggedCard, card)) {
                columnDragged.moveStack(draggedCard, column);
                column.render();
            }
        },
        //OnDragLeave: function (panelId, draggedPanel, card) {};
        OnDragStart: function(panelId, dragCallbacks, card) {
            //$.Msg("FreeCellCard OnDragStart", this.value());
            var column = card.container;
            var stackSlice = column.getStack(card);
            if (this.fc.isOrdered(stackSlice)) {
                CardLibrary.Card.prototype.OnDragStart.apply(this, arguments);
            }
        },
        OnDragEnd: function(panelId, draggedPanel, card) {
            this.fc.process();
            Game.EmitSound("Card.cardSlide1");
            CardLibrary.Card.prototype.OnDragEnd.apply(this, arguments);
        },
        OnDblClick: function(card) {
            //$.Msg("FreeCellCard Card OnDblClick ", card.value());
            var column = card.container;
            if (column.last() == card) {
                for (var i = 0; i < this.fc.cells.length; i++) {
                    var cell = this.fc.cells[i];
                    if (cell.isEmpty()) {
                        column.moveStack(card, cell);
                        cell.render()
                            //$.Msg("move to cell", i);
                        break;
                    }
                }
            }
            this.fc.process();
        },
        OnMouseOver: function(card) {
            if (card.container.type() == "foundation") return;
            var column = card.container;
            var stackSlice = column.getStack(card);
            if (this.fc.isOrdered(stackSlice)) {
                CardLibrary.Card.prototype.OnMouseOver.apply(this, arguments);
            }
        },
        OnMouseOut: function(card) {
            //$.Msg("FreeCellCard OnMouseOut ", card.value());
            if (this.fc.rightClickedCard) {
                this.fc.rightClickedCard.style.zIndex(this.fc.rightClickedCard.style.zIndex());
                this.fc.rightClickedCard = null;
            }
            CardLibrary.Card.prototype.OnMouseOut.apply(this, arguments);
        },
        OnContextMenu: function(card) {
            //$.Msg("FreeCellCard OnContextMenu ", card.value());
            if (this.fc.rightClickedCard) this.fc.rightClickedCard.style.zIndex(this.fc.rightClickedCard.style.zIndex());
            this.fc.rightClickedCard = card;
            card.panel.style.zIndex = 999;
        }
    });

    function Column(options) {
        this.fc = options.fc;
        this.type = _.observable(options.type);
        CardLibrary.Pile.call(this, options);
    }
    _.inherits(Column, CardLibrary.Pile);
    _.extend(Column.prototype, {
        OnDragEnter: function(a, draggedPanel, card) {
            //$.Msg("Column Column OnDragDrop");
            var draggedCard = draggedPanel.card;
            //$.Msg("dragenter ", draggedCard.value(), " onto empty column ", this.type());
            this.slot.droppable(this.isValidMove(draggedCard));
            CardLibrary.Pile.prototype.OnDragEnter.apply(this, arguments);
        },
        OnDragDrop: function(panelId, draggedPanel, card) {
            //$.Msg("FreeCell Column OnDragDrop");
            var draggedCard = draggedPanel.card;
            //$.Msg("dropped ", draggedCard.value(), " onto empty column ", this.type());
            if (this.isValidMove(draggedCard)) {
                draggedCard.container.moveStack(draggedCard, this);
                this.render();
            }
        },
        OnMouseOver: function(card) {},
        isValidMove: function(draggedCard) {
            //$.Msg("isValidMove");
            var column = this;
            var columnDragged = draggedCard.container;
            if (columnDragged.type() == "foundation") return false;
            if (!column.isEmpty()) return false;
            var stackSlice = columnDragged.getStack(draggedCard);
            var maxStackSize = this.fc.getMaxStackSize(true);
            var columnType = column.type();
            if (columnType == "column" &&
                this.fc.isOrdered(stackSlice) &&
                stackSlice.length <= maxStackSize) {
                //$.Msg("valid move to empty column");
                return true;
            } else if (columnType == "cell" &&
                columnDragged.type() != "cell" &&
                stackSlice.length == 1) {
                //$.Msg("valid move to empty cell");
                return true;
            } else if (columnType == "foundation" &&
                this.fc.getRankValue(draggedCard) == 1 &&
                stackSlice.length == 1) {
                //$.Msg("valid move to empty foundation");
                return true;
            }
            //$.Msg("invalid move");
            return false;
        },
        add: function(card) {
            card.container = this;
            this.items.push(card);
        },
        getStack: function(card, bSplice) {
            var index = this.items.indexOf(card);
            if (bSplice) {
                return this.items.splice(index, this.items.length() - index).items;
            } else {
                return this.items.slice(index, this.items.length()).items;
            }
        },
        moveStack: function(card, destColumn, bNoUndo) {
            Game.EmitSound("Card.cardSlide1");
            //$.Msg("Column moveStack");
            if (!bNoUndo) {
                this.fc.history.push({
                    card: card,
                    column: card.container,
                    toFoundation: destColumn.type() == "foundation"
                });
            }
            var stack = this.getStack(card, true);
            stack.forEach(function(c) {
                destColumn.add(c);
                if (destColumn.type() == "foundation") c.draggable(false);
            });
        }
    });


    fc = new FreeCell();
    fc.init();
    $.Schedule(1, function() {
        //fc.deal(2217);
        OnNewGame();
    });

    $.Msg("main.js");
})();