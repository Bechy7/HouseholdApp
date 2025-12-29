import { StyleSheet } from "react-native";

export default StyleSheet.create({
    text: { fontSize: 16, marginBottom: 10 },
    noteRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 5 },
    note: { fontSize: 18 },
    one_row: {display:"flex",flexDirection: "row", justifyContent:"space-between", alignItems:"center"},
    modal:{backgroundColor: "#ffffffff", padding:24},
    closeButton:{padding:12},
    modal_container:{width: '100%', height:"100%", backgroundColor: '#ffffffff', padding: 24},
    addGroceryButton: { margin: 3 },
    addRecipeButton:{padding:12, backgroundColor: "#E0E0E0", alignItems:"center"}, 
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    inputRow: { flexDirection: "row", marginBottom: 20 },
    input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginRight: 10 },
    groceryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 5 },
    grocery: { fontSize: 18 },
    scrollView: { paddingRight: 10 },
    select: { width: 75, marginRight: 10 },
    storeTitle: { fontSize: 20, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
    suggestions: { backgroundColor: "#f5f5f5", borderRadius: 8, padding: 10, marginBottom: 10, },
    suggestion: { paddingVertical: 8, fontSize: 16, borderBottomWidth: 1, borderBottomColor: "#ddd", },
});
