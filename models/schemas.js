// ...existing code...
type: {
  type: String,
  autoValue() {
    // Remove any defaultValue that might exist here
    // Keep only the autoValue logic
    if (this.isInsert) {
      return 'item';
    }
    return undefined;
  }
}
// ...existing code...
