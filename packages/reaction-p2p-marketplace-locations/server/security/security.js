/**
 * security definitions
 *
 * The following security definitions use the ongoworks:security package.
 * Rules within a single chain stack with AND relationship. Multiple
 * chains for the same collection stack with OR relationship.
 * See https://github.com/ongoworks/meteor-security
 *
 * It"s important to note that these security rules are for inserts,
 * updates, and removes initiated from untrusted (client) code.
 * Thus there may be other actions that certain roles are allowed to
 * take, but they do not necessarily need to be listed here if the
 * database operation is executed in a server method.
 */

/*
 * Assign to some local letiables to keep code
 * short and sweet
 */
let MapMarkers = ReactionCore.Collections.MapMarkers;

/**
 * Define all security rules
 */

/**
 * admin security
 * Permissive security for users with the "admin" role
 */
Security.permit(["insert", "update", "remove"]).collections([
  MapMarkers
]).ifHasRole({
  role: ["admin", "createProduct"],
  group: ReactionCore.getShopId()
}).ifShopIdMatches().exceptProps(["shopId"]).apply();

/*
 * Users with the "admin" or "owner" role may update and
 * remove products, but createProduct allows just for just a product editor
 */
MapMarkers.permit(["insert", "update", "remove"]).ifHasRole({
  role: ["admin", "createProduct"],
  group: ReactionCore.getShopId()
}).ifShopIdMatchesThisId().apply();
