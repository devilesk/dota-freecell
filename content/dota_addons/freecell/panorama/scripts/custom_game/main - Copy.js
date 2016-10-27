"use strict";

var CardLibrary;

function DebounceFactory() {
  // 'private' variable for instance
  // The returned function will be able to reference this due to closure.
  // Each call to the returned function will share this common timer.
  var timeout = null;
  var schedule = {};
  
  return function (func, wait, immediate) {

      // Calling debounce returns a new anonymous function
      return function() {
          // reference the context and args for the setTimeout function
          var context = this, 
              args = arguments;

          // Should the function be called now? If immediate is true
          //   and not already in a timeout then the answer is: Yes
          var callNow = immediate && !timeout && schedule[timeout];

          // This is the basic debounce behaviour where you can call this 
          //   function several times, but it will only execute once 
          //   [before or after imposing a delay]. 
          //   Each time the returned function is called, the timer starts over.
          //clearTimeout(timeout);   
          delete schedule[timeout];
          
          // Set the new timeout
          timeout = $.Schedule(wait, function() {

               // Inside the timeout function, clear the timeout variable
               // which will let the next execution run when in 'immediate' mode
               timeout = null;

               // Check if the function already ran with the immediate flag
               if (!immediate) {
                 // Call the original function with apply
                 // apply lets you define the 'this' object as well as the arguments 
                 //    (both captured before setTimeout)
                 func.apply(context, args);
               }
          });
          schedule[timeout] = true;
          
          // Immediate mode and no wait timer? Execute the function..
          if (callNow) func.apply(context, args);  
       }; 
  };
}

function ThrottleFactory() {
  var context, args, result;
  var timeout = null;
  var schedule = {};
  var previous = 0;
  return function(func, wait, options) {
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      if (schedule[timeout]) {
        delete schedule[timeout];
        result = func.apply(context, args);
      }
      if (!timeout) context = args = null;
    };
    return function() {
      var now = Date.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          $.Msg("clear", timeout);
          //clearTimeout(timeout);
          timeout = null;
          delete schedule[timeout];
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = $.Schedule(remaining, later);
        schedule[timeout] = true;
        $.Msg("schedule", timeout);
      }
      return result;
    };
  };
}

function FreeCell() {
  this.seed = 0;
  this.columns = [[], [], [], [], [], [], [], []];
  this.cells = [[], [], [], []];
  this.foundations = [[], [], [], []];
};
FreeCell.prototype.setSeed = function(seed) {
  this.seed = seed;
};
FreeCell.prototype.getSeed = function() {
  return this.seed;
};
FreeCell.prototype.rand = function() {
  $.Msg("seed", this.getSeed());
  this.setSeed((this.getSeed() * 214013 + 2531011) & 0x7FFFFFFF);
  return ((this.getSeed() >> 16) & 0x7fff);
};
FreeCell.prototype.maxRand = function(mymax) {
  return this.rand() % mymax;
};
FreeCell.prototype.shuffle = function(deck) {
  if (deck.length) {
    var i = deck.length;
    while (--i) {
      var j = this.maxRand(i+1);
      $.Msg("maxRand", j);
      var tmp = deck[i];
      deck[i] = deck[j];
      deck[j] = tmp;
    }
  }
  return deck;
};
FreeCell.prototype.deal = function (seed) {
  $.Msg("deal");
  var deck = [];
  this.setSeed(seed);
  this.columns = [[], [], [], [], [], [], [], []];
  this.cells = [[], [], [], []];
  this.foundations = [[], [], [], []];
  for (var i = 0 ; i < 52; i++) {
    var rank = "a23456789tjqk".charAt(Math.floor(i / 4));
    var suit = "cdhs".charAt(i % 4);
    deck.push(rank + suit);
  }
  deck = this.shuffle(deck).reverse();
  for (var i = 0; i < deck.length; i++) {
    var card = deck[i];
    this.columns[i % 8].push(card);
  }
  
  /*this.columns.forEach(function (column, index) {
    column.forEach(function (card) {
      $.Msg(card, index);
    });
  });*/
  this.renderColumns();
};
FreeCell.prototype.renderColumns = function () {
  var self = this;
  this.columns.forEach(function (column, index) {
    self.renderColumn(index);
  });
};
FreeCell.prototype.renderColumn = function (i) {
  var column = this.columns[i];
  column.forEach(function (c, j) {
    var card = CardLibrary.cards[c];
    card.columnIndex = i;
    card.cellIndex = null;
    card.zIndex(j*10);
    card.x(370 + 160 * i);
    card.y(370 + 30 * j);
    $.Msg(c, i);
  });
};
FreeCell.prototype.renderCell = function (i) {
  $.Msg("renderCell ", i);
  var cell = this.cells[i];
  cell.forEach(function (c, j) {
    var card = CardLibrary.cards[c];
    card.columnIndex = null;
    card.cellIndex = i;
    card.zIndex(j*10);
    card.x(180 + 160 * i);
    card.y(100 + 30 * j);
    $.Msg(c, i);
  });
};
FreeCell.prototype.renderFoundation = function (i) {
  var foundation = this.foundations[i];
  foundation.forEach(function (c, j) {
    var card = CardLibrary.cards[c];
    card.columnIndex = null;
    card.cellIndex = null;
    card.foundationIndex = i;
    card.zIndex(j*10);
    card.x(1180 + 160 * i);
    card.y(100 + 5 * j);
    $.Msg(c, i);
  });
};

FreeCell.prototype.getMaxStackSize = function (toEmptyColumn) {
  var emptyCellCount = 1;
  var emptyColumnCount = 0;
  
  this.cells.forEach(function (cell) {
    if (cell.length == 0) emptyCellCount++;
  });
  this.columns.forEach(function (column) {
    if (column.length == 0) emptyColumnCount++;
  });
  if (toEmptyColumn) emptyColumnCount--;
  return emptyCellCount * Math.pow(2, emptyColumnCount);
};

FreeCell.prototype.getRankValue = function (card) {
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
};

FreeCell.prototype.isOrdered = function (cards) {
  for (var i = 0; i < cards.length - 1; i++) {
    var a = CardLibrary.cards[cards[i]];
    var b = CardLibrary.cards[cards[i+1]];
    $.Msg("comparing ", a.value(), " ", b.value());
    if (a.suitColor() == b.suitColor() || this.compareRank(b, a) != -1) {
      return false;
    }
  }
  return true;
};

FreeCell.prototype.process = function () {
  $.Msg("processing");
  var self = this;
  var repeat = false;
  var minFoundationRank = 14;
  this.foundations.forEach(function (foundation) {
    if (foundation.length) {
      var card = CardLibrary.cards[foundation[foundation.length - 1]];
      var rankValue = self.getRankValue(card);
      if (rankValue < minFoundationRank) {
        minFoundationRank = rankValue;
      }
    }
    else {
      minFoundationRank = 0;
    }
  });
  this.columns.forEach(function (column, j) {
    if (column.length) {
      var card = CardLibrary.cards[column[column.length - 1]];
      var columnIndex = column.indexOf(card.value());
      var rankValue = self.getRankValue(card);
      $.Msg("rankValue ", rankValue);
      if (rankValue == minFoundationRank + 1) {
        if (rankValue == 1) {
          for (var i = 0; i < self.foundations.length; i++) {
            if (self.foundations[i].length == 0) {
              var foundation = self.foundations[i];
              var stack = column.splice(columnIndex, column.length - columnIndex);
              stack.forEach(function (card) {
                foundation.push(card);
              });
              self.renderFoundation(i);
              repeat = true;
              break;
            }
          }
        }
        else {
          $.Msg("rankValue != 1");
          for (var i = 0; i < self.foundations.length; i++) {
            if (self.foundations[i].length != 0) {
              var foundation = self.foundations[i];
              var foundationCard = CardLibrary.cards[foundation[foundation.length - 1]];
              if (self.getRankValue(foundationCard) == rankValue - 1 && foundationCard.suit() == card.suit()) {
                var stack = column.splice(columnIndex, column.length - columnIndex);
                stack.forEach(function (card) {
                  foundation.push(card);
                });
                self.renderFoundation(i);
                repeat = true;
                break;
              }
            }
          }
        }
      }
    }
  });
  this.cells.forEach(function (cell, j) {
    if (cell.length) {
      var card = CardLibrary.cards[cell[cell.length - 1]];
      var cellIndex = cell.indexOf(card.value());
      var rankValue = self.getRankValue(card);
      $.Msg("rankValue ", rankValue);
      if (rankValue == minFoundationRank + 1) {
        if (rankValue == 1) {
          for (var i = 0; i < self.foundations.length; i++) {
            if (self.foundations[i].length == 0) {
              var foundation = self.foundations[i];
              var stack = cell.splice(cellIndex, cell.length - cellIndex);
              stack.forEach(function (card) {
                foundation.push(card);
              });
              self.renderFoundation(i);
              repeat = true;
              break;
            }
          }
        }
        else {
          $.Msg("rankValue != 1");
          for (var i = 0; i < self.foundations.length; i++) {
            if (self.foundations[i].length != 0) {
              var foundation = self.foundations[i];
              var foundationCard = CardLibrary.cards[foundation[foundation.length - 1]];
              if (self.getRankValue(foundationCard) == rankValue - 1 && foundationCard.suit() == card.suit()) {
                var stack = cell.splice(cellIndex, cell.length - cellIndex);
                stack.forEach(function (card) {
                  foundation.push(card);
                });
                self.renderFoundation(i);
                repeat = true;
                break;
              }
            }
          }
        }
      }
    }
  });
  
  $.Msg("process minFoundationRank ", minFoundationRank);
  if (repeat) this.process();
};

FreeCell.prototype.compareRank = function (a, b) {
  return this.getRankValue(a) - this.getRankValue(b);
};

FreeCell.prototype.OnDragEnter = function (a, draggedPanel, card) {
};

FreeCell.prototype.OnDragDrop = function (panelId, draggedPanel, card) {
  $.Msg("freecell OnDragDrop", this.getMaxStackSize());
  var draggedCard = draggedPanel.data().card;
  var maxStackSize = this.getMaxStackSize();
  $.Msg(this.compareRank(draggedCard, card), " ", draggedCard.columnIndex, " ", card.columnIndex);
  if (card.suitColor() != draggedCard.suitColor() && this.compareRank(draggedCard, card) == -1) {
    var column = this.columns[card.columnIndex];
    if (draggedCard.columnIndex || draggedCard.columnIndex == 0) {
      var columnDragged = this.columns[draggedCard.columnIndex];
      var columnIndex = column.indexOf(card.value());
      var columnIndexDragged = columnDragged.indexOf(draggedCard.value());
      $.Msg(this.compareRank(draggedCard, card), " ", card.value(), " ", column, " ", column.indexOf(card.value()), " ", columnDragged.indexOf(draggedCard.value()));
      var stackSlice = columnDragged.slice(columnIndexDragged, columnDragged.length);
      if (this.isOrdered(stackSlice) && stackSlice.length <= maxStackSize) {
        var stack = columnDragged.splice(columnIndexDragged, columnDragged.length - columnIndexDragged);
        stack.forEach(function (card) {
          column.push(card);
        });
        $.Msg("stack ", stack, column);
        this.renderColumn(card.columnIndex);
        this.renderColumn(draggedCard.columnIndex);
      }
    }
    else if (draggedCard.cellIndex || draggedCard.cellIndex == 0) {
      $.Msg("dragged card has in freecell");
      var cellDragged = this.cells[draggedCard.cellIndex];
      var columnIndex = column.indexOf(card.value());
      var cellIndexDragged = cellDragged.indexOf(draggedCard.value());
      $.Msg(this.compareRank(draggedCard, card), " ", card.value(), " ", column, " ", column.indexOf(card.value()), " ", cellDragged.indexOf(draggedCard.value()));
      var stackSlice = cellDragged.slice(cellIndexDragged, cellDragged.length);
      if (this.isOrdered(stackSlice) && stackSlice.length <= maxStackSize) {
        var stack = cellDragged.splice(cellIndexDragged, cellDragged.length - cellIndexDragged);
        stack.forEach(function (card) {
          column.push(card);
        });
        $.Msg("stack ", stack, column);
        this.renderCell(draggedCard.cellIndex);
        this.renderColumn(card.columnIndex);
      }
    }
    else {
      $.Msg("dragged card not in freecell", draggedCard.cellIndex);
    }
  }
  else {
    $.Msg("dropped on something", draggedCard.cellIndex, card.isSlot);
    if (card.isSlot && (card.columnIndex || card.columnIndex == 0)) {
      $.Msg("dropped on column slot");
      var column = this.columns[card.columnIndex];
      if (draggedCard.columnIndex || draggedCard.columnIndex == 0) {
        var columnDragged = this.columns[draggedCard.columnIndex];
        var columnIndexDragged = columnDragged.indexOf(draggedCard.value());
        var stackSlice = columnDragged.slice(columnIndexDragged, columnDragged.length);
        maxStackSize = this.getMaxStackSize(true);
        if (this.isOrdered(stackSlice) && stackSlice.length <= maxStackSize) {
          var stack = columnDragged.splice(columnIndexDragged, columnDragged.length - columnIndexDragged);
          stack.forEach(function (card) {
            column.push(card);
          });
          $.Msg("stack ", stack, column);
          this.renderColumn(card.columnIndex);
          this.renderColumn(draggedCard.columnIndex);
        }
      }
      else if (draggedCard.cellIndex || draggedCard.cellIndex == 0) {
        $.Msg("dragged card has in freecell");
        var cellDragged = this.cells[draggedCard.cellIndex];
        var cellIndexDragged = cellDragged.indexOf(draggedCard.value());
        var stackSlice = cellDragged.slice(cellIndexDragged, cellDragged.length);
        if (stackSlice.length <= maxStackSize) {
          var stack = cellDragged.splice(cellIndexDragged, cellDragged.length - cellIndexDragged);
          stack.forEach(function (card) {
            column.push(card);
          });
          $.Msg("stack ", stack, column);
          this.renderCell(draggedCard.cellIndex);
          this.renderColumn(card.columnIndex);
        }
      }
    
    }
    else if (card.foundationIndex || card.foundationIndex == 0) {
      $.Msg("destination card in foundation");
      var foundation = this.foundations[card.foundationIndex];
      
      if (draggedCard.suit() == card.suit() && this.compareRank(draggedCard, card) == 1) {
        if (draggedCard.cellIndex || draggedCard.cellIndex == 0) {
          $.Msg("dragged card from freecell to foundation");
          var cellDragged = this.cells[draggedCard.cellIndex];
          var cellIndexDragged = cellDragged.indexOf(draggedCard.value());
          var stackSlice = cellDragged.slice(cellIndexDragged, cellDragged.length);
          if (stackSlice.length == 1) {
            var stack = cellDragged.splice(cellIndexDragged, cellDragged.length - cellIndexDragged);
            stack.forEach(function (card) {
              foundation.push(card);
            });
            $.Msg("stack ", stack, column);
            this.renderCell(draggedCard.cellIndex);
            this.renderFoundation(card.foundationIndex);
          }
        }
        else {
          $.Msg("dragged card from column to foundation");
          var columnDragged = this.columns[draggedCard.columnIndex];
          var columnIndexDragged = columnDragged.indexOf(draggedCard.value());
          var stackSlice = columnDragged.slice(columnIndexDragged, columnDragged.length);
          if (stackSlice.length == 1) {
            var stack = columnDragged.splice(columnIndexDragged, columnDragged.length - columnIndexDragged);
            stack.forEach(function (card) {
              foundation.push(card);
            });
            $.Msg("stack ", stack, column);
            this.renderColumn(draggedCard.columnIndex);
            this.renderFoundation(card.foundationIndex);
          }
        }
      }
    }
  }
  this.process();
};
FreeCell.prototype.OnDragLeave = function (panelId, draggedPanel, card) {

};
FreeCell.prototype.OnDragStart = function (panelId, dragCallbacks, card) {
  $.Msg("freecell OnDragStart", this.seed, " ", card.rank());
};
FreeCell.prototype.OnDragEnd = function (panelId, draggedPanel, card) {

};
FreeCell.prototype.OnDblClick = function (card) {
  $.Msg("freecell OnDblClick", this.seed, " ", card.rank());
  var column = this.columns[card.columnIndex];
  var columnIndex = column.indexOf(card.value());
  if (columnIndex == column.length - 1) {
    for (var i = 0; i < this.cells.length; i++) {
      var cell = this.cells[i];
      if (cell.length == 0) {
        var stack = column.splice(columnIndex, column.length - columnIndex);
        stack.forEach(function (card) {
          cell.push(card);
        });
        this.renderCell(i);
        $.Msg("moving to free cell ", i);
        break;
      }
    }
  }
  this.process();
};

(function () {
  GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_TIMEOFDAY, false );
  GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_HEROES, false );
  GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_FLYOUT_SCOREBOARD, false );
  GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_PANEL, false );
  GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_MINIMAP, false );
  GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_PANEL, false );
  GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_SHOP, false );
  GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_MENU_BUTTONS, false );
  
  
  CardLibrary = GameUI.CustomUIConfig().CardLibrary;
  CardLibrary.createDeck(true, true, true, false);
    
  //CardLibrary.cards["3h"].pos(100, 100);
  /*for (var i = 0 ; i < 52; i++) {
    var rank = "a23456789tjqk".charAt(Math.floor(i / 4));
    var suit = "cdhs".charAt(i %  4);
    $.Msg("2 + i/10 ", 2 + i/10, " ", rank + suit);
    (function (rank, suit) {
      $.Schedule(2 + i/10, function () {
        var card = CardLibrary.cards[rank + suit]
        $.Msg("card ", card.x(), " ", card.y());
        //card.x(card.x() + 100);
        //card.y(card.y() + 100);
        card.visible(false);
      });
    })(rank, suit);
  }
  
  for (var i = 51 ; i >= 0; i--) {
    var rank = "a23456789tjqk".charAt(Math.floor(i / 4));
    var suit = "cdhs".charAt(i % 4);
    $.Msg("2 + i/10 ", 2 + i/10, " ", rank + suit);
    (function (rank, suit) {
      $.Schedule(7.1 + (52-i)/10, function () {
        var card = CardLibrary.cards[rank + suit]
        $.Msg("card ", card.x(), " ", card.y());
        //card.x(card.x() - 100);
        //card.y(card.y() + 100);
        //card.faceUp(false);
        card.visible(true);
      });
    })(rank, suit);
  }*/
       
  var fc = new FreeCell();
  $.Schedule(1, function () {
    //fc.deal(2217);
    fc.deal(8826);
  });
    
  // bind freecell event handlers to cards
  for (var i = 0 ; i < 52; i++) {
    var rank = "a23456789tjqk".charAt(Math.floor(i / 4));
    var suit = "cdhs".charAt(i % 4);
    var card = CardLibrary.cards[rank+suit];
    
    card.RegisterHandler('OnDragEnter', fc.OnDragEnter.bind(fc));
    card.RegisterHandler('OnDragDrop', fc.OnDragDrop.bind(fc));
    card.RegisterHandler('OnDragLeave', fc.OnDragLeave.bind(fc));
    card.RegisterHandler('OnDragStart', fc.OnDragStart.bind(fc));
    card.RegisterHandler('OnDragEnd', fc.OnDragEnd.bind(fc));
    card.RegisterHandler('OnDblClick', fc.OnDblClick.bind(fc));
  }
  
  var columns = [];
  for (var i = 0; i < 8; i++) {
    var column = CardLibrary.createCard(CardLibrary.contextPanel, {
      x: i * 30,
      y: 0,
      zIndex: -1,
      rank: "",
      suit: "",
      visible: true,
      faceUp: false,
      draggable: false,
      droppable: true
    });
    column.columnIndex = i;
    column.isSlot = true;
    column.x(370 + 160 * i);
    column.y(370);
    columns.push(column);
    
    column.RegisterHandler('OnDragEnter', fc.OnDragEnter.bind(fc));
    column.RegisterHandler('OnDragDrop', fc.OnDragDrop.bind(fc));
    column.RegisterHandler('OnDragLeave', fc.OnDragLeave.bind(fc));
    column.RegisterHandler('OnDragStart', fc.OnDragStart.bind(fc));
    column.RegisterHandler('OnDragEnd', fc.OnDragEnd.bind(fc));
    column.RegisterHandler('OnDblClick', fc.OnDblClick.bind(fc));
  }
  
  var cells = [];
  for (var i = 0; i < 4; i++) {
    var cell = CardLibrary.createCard(CardLibrary.contextPanel, {
      x: i * 30,
      y: 0,
      zIndex: -1,
      rank: "",
      suit: "",
      visible: true,
      faceUp: false,
      draggable: false,
      droppable: true
    });
    cell.cellIndex = i;
    cell.isSlot = true;
    cell.x(180 + 160 * i);
    cell.y(100);
    cells.push(cell);
 }
  
  var foundations = [];
  for (var i = 0; i < 4; i++) {
    var foundation = CardLibrary.createCard(CardLibrary.contextPanel, {
      x: i * 30,
      y: 0,
      zIndex: -1,
      rank: "",
      suit: "",
      visible: true,
      faceUp: false,
      draggable: false,
      droppable: true
    });
    foundation.cellIndex = i;
    foundation.isSlot = true;
    foundation.x(1180 + 160 * i);
    foundation.y(100);
    foundations.push(foundation);
 }
  //fc.deal(617);
  /*$.Schedule(3, function () {
    CardLibrary.cards["3h"].pos(500, 500);
  });*/
           
  $.Msg("main.js");
   
  //GameUI.CustomUIConfig().cardClickMode = 'select';
  //GameEvents.Subscribe( "set_timer", SetTimer );

})();