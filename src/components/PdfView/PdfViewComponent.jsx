// import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// const styles = StyleSheet.create({
//   page: { padding: 30 },
//   section: { marginBottom: 10 },
//   title: { fontSize: 18, marginBottom: 10 },
//   text: { fontSize: 12 }
// });

// const PdfDocument = ({ data }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.section}>
//         <Text style={styles.title}>{data.title}</Text>
//       </View>

//       {data.items.map((item, index) => (
//         <View key={index} style={styles.section}>
//           <Text style={styles.text}>
//             {item.nombre} - {item.descripcion}
//           </Text>
//         </View>
//       ))}
//     </Page>
//   </Document>
// );

// export default function PdfView({ data }) {
//   return (
//     <PDFViewer width="100%" height="600">
//       <PdfDocument data={data} />
//     </PDFViewer>
//   );
// }