import React from "react";
import { useDispatch } from "react-redux";
import { promote } from "../actions";

function sendPromote(event, dispatch) {
  event.preventDefault();
  dispatch(promote(Number(event.target.elements.promotion.value)));
}

function PromotionForm(props) {
  const dispatch = useDispatch();
  if (props.show) {
    return (
      <div className="modal-container">
        <form className="modal" onSubmit={e => sendPromote(e, dispatch)}>
          <h1>Pawn Promotion</h1>
          <h2>Select a piece to promote your pawn to:</h2>
          <div className="two-columns">
            <label>Queen</label>
            <input type="radio" value="2" name="promotion" required />
            <label>Rook </label>
            <input type="radio" value="3" name="promotion" />
            <label>Bishop</label>
            <input type="radio" value="4" name="promotion" />
            <label>Knight</label>
            <input type="radio" value="5" name="promotion" />
          </div>
          <input type="submit" value="Promote" />
        </form>
      </div>
    );
  } else {
    return <React.Fragment></React.Fragment>;
  }
}

export default PromotionForm;
