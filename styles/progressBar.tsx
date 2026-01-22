import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 24,
    paddingBottom: 24,
  },

  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  label: {
    textAlign: "center",
    fontSize: 12,
  },

  labelActive: {
    fontWeight: "bold",
  },

  barContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  stepActive: {
    backgroundColor: "#806752",
  },

  line: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D1D6",
  },

  lineActive: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    backgroundColor: "#806752",
    marginRight: -4,
    zIndex: 999
  },

  buttonLineActive: {
    width: "50%",
    height: 8,
    borderRadius: 4,
    backgroundColor: "#806752",
    marginHorizontal: -4,
    zIndex: 999
  }
});
