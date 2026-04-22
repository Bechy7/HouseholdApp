import { Colors } from "@/constants/theme";
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
    backgroundColor: Colors.primary,
  },

  line: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D1D6",
    marginLeft:-4
  },

  lineActive: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: -4,
    zIndex: 999
  },

  buttonLineActive: {
    width: "50%",
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginHorizontal: -4,
    zIndex: 999
  }
});
