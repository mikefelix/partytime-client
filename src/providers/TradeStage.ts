export const enum TradeStage {
  Creating = 0,        // Being filled out
  Offered = 1,         // Sent to server, being considered by partner
  Counteroffered = 2,  // Counteroffer made, being considered by originator
  Accepted = 3,        // Counteroffer accepted by originator
  Rejected = 4         // Counteroffer rejected by originator or partner
}
