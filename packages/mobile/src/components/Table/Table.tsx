import { View, Text } from "react-native";
import React from "react";
import { Table, Row, Rows } from "react-native-table-component";
import { COLORS, FONTS } from "../../constants";

interface Props {
  tableHead: string[];
  title: string;
  tableData: Array<Array<any>>;
}
const T: React.FC<Props> = ({ tableHead, title, tableData }) => {
  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        width: "100%",
      }}
    >
      <Text
        style={{
          color: COLORS.white,
          textAlign: "center",
          marginBottom: 10,
          fontFamily: FONTS.regularBold,
          fontSize: 20,
          letterSpacing: 2,
        }}
      >
        {title}
      </Text>
      <Table
        borderStyle={{
          borderWidth: 2,
          borderColor: "transparent",
        }}
      >
        <Row
          data={tableHead}
          style={{ height: 40, backgroundColor: "#4F5D73" }}
          textStyle={{
            color: COLORS.white,
            fontFamily: FONTS.regularBold,
            textAlign: "center",
            fontSize: 20,
          }}
        />
        {tableData.map((data) => (
          <Row
            key={data[0]}
            data={data}
            style={{
              backgroundColor:
                data[2] === -1
                  ? "#FADCB6"
                  : data[2] < 3
                  ? "#FEEED1"
                  : "#D6D2F8",
            }}
            textStyle={{
              margin: 6,
              fontFamily: FONTS.regular,
              textAlign: "center",
            }}
          />
        ))}
      </Table>
    </View>
  );
};

export default T;
