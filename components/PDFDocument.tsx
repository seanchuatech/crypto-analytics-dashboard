'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});

export function PDFDocument({ data }: { data: { date: string; price: number }[] }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text>Crypto Price Data</Text>
        {data.map((item, idx) => (
          <View style={styles.row} key={idx}>
            <Text>{item.date}</Text>
            <Text>{item.price}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
