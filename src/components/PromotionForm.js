import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { promote } from "../actions";
import Image from "./Image";

function sendPromote(event, dispatch) {
  event.preventDefault();
  dispatch(promote(Number(event.target.elements.promotion.value)));
}

function PromotionForm() {
  const dispatch = useDispatch();
  let promotedTile = useSelector(state => state.promotedTile);
  if (promotedTile !== -1) {
    let multiplier = promotedTile < 8 ? 1 : -1;
    return (
      <div className="modal">
        <div className="modal-wrapper">
          <form className="modal-content" onSubmit={e => sendPromote(e, dispatch)}>
            <h1>Pawn Promotion</h1>
            <h2>Select a piece to promote your pawn to:</h2>
            <div className="promotion-input">
              <Image name={multiplier * 2} />
              <Image name={multiplier * 3} />
              <Image name={multiplier * 4} />
              <Image name={multiplier * 5} />
              <label>Queen </label>
              <label>Rook </label>
              <label>Bishop </label>
              <label>Knight</label>
              <input type="radio" value="2" name="promotion" required />
              <input type="radio" value="3" name="promotion" />
              <input type="radio" value="4" name="promotion" />
              <input type="radio" value="5" name="promotion" />
              <input type="submit" value="Promote" />
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return <React.Fragment></React.Fragment>;
  }
}

export default PromotionForm;
