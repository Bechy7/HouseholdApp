import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: "#ffffffff" },
    header: { fontSize: 24, fontWeight: "bold"},
    text: { fontSize: 16, marginBottom: 10 },
    inputRow: { flexDirection: "row", marginBottom: 20 },
    input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginRight: 10 },
    noteRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 5 },
    note: { fontSize: 18 },
    one_row: {display:"flex",flexDirection: "row", justifyContent:"space-between", alignItems:"center"},
    addButton:{padding:12, backgroundColor: "#E0E0E0", alignItems:"center"}, 
    modal:{backgroundColor: "#ffffffff", padding:24},
    closeButton:{padding:12},
    modal_container:{width: '100%', height:"100%", backgroundColor: '#ffffffff', padding: 24}
});
