"use strict";

var _card;

function OnActivate() {
    //$.Msg("OnActivate");
    //_card.faceUp(!_card.faceUp());
}

function OnMouseOver() {
    //$.Msg("OnMouseOver", _card.zIndex());
    //$.GetContextPanel().style["z-index"] = 999;

    //$.GetContextPanel().style["y"] = _card.y() + 20 + "px";

    //_card._OnMouseOver();
}

//var OnMouseOverThrottled = GameUI.CustomUIConfig().sharedHoverDebounce(OnMouseOver, 2000);
//var OnMouseOverThrottled = GameUI.CustomUIConfig().sharedHoverThrottle(OnMouseOver, 200);
//var OnMouseOutThrottled = GameUI.CustomUIConfig().sharedHoverThrottle(OnMouseOut, 1000);

function OnMouseOut() {
    //$.Msg("OnMouseOut");
    //_card.zIndex(_card.zIndex());
    //$.GetContextPanel().style["y"] = _card.y() + "px";

    //_card._OnMouseOut();
}

function SetCard(card) {
    _card = card;
}

function GetCard() {
    return _card;
}

function OnDragEnter(a, draggedPanel) {
    $.Msg("OnDragEnter");
    //_card._OnDragEnter(a, draggedPanel);
    return true;
}

function OnDragDrop(panelId, draggedPanel) {
    //$.Msg("OnDragDrop");
    _card._OnDragDrop(panelId, draggedPanel);

    return true;
}

function OnDragLeave(panelId, draggedPanel) {
    //$.Msg("OnDragLeave");
    _card._OnDragLeave(panelId, draggedPanel);
    return true;
}

function OnDragStart(panelId, dragCallbacks) {
    //$.Msg("OnDragStart");
    _card._OnDragStart(panelId, dragCallbacks);
    return true;
}

function OnDragEnd(panelId, draggedPanel) {
    //$.Msg("OnDragEnd");
    _card._OnDragEnd(panelId, draggedPanel);

    // kill the display panel
    draggedPanel.DeleteAsync(0);

    // restore our look
    $.GetContextPanel().RemoveClass("dragging_from");
    return true;
}

function OnDblClick() {
    $.Msg("OnDblClick");
    _card._OnDblClick();
}

function OnContextMenu() {
    $.Msg("OnContextMenu");
    //_card._OnContextMenu();
}

function OnFocus() {
    $.Msg("OnFocus");
    _card._OnFocus();
}

function OnBlur() {
    $.Msg("OnBlur");
    _card._OnBlur();
}

(function() {
    $.GetContextPanel().SetCard = SetCard;
    $.GetContextPanel().GetCard = GetCard;
    /*
	$.RegisterEventHandler( 'DragEnter', $.GetContextPanel(), OnDragEnter );
	$.RegisterEventHandler( 'DragDrop', $.GetContextPanel(), OnDragDrop );
	$.RegisterEventHandler( 'DragLeave', $.GetContextPanel(), OnDragLeave );
	$.RegisterEventHandler( 'DragStart', $.GetContextPanel(), OnDragStart );
	$.RegisterEventHandler( 'DragEnd', $.GetContextPanel(), OnDragEnd );
  */
    //$.Msg("cards/card.js");
})();