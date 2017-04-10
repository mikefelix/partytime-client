export const enum InviteStage {
  Creating = 0,        // Being filled out
  Offered = 1,         // Sent to server, being considered by partner
  Accepted = 2,        // Invitation accepted by originator
  Rejected = 3         // Invitation rejected by originator or partner
}
