import { Document, Page, Text, View, StyleSheet, Svg, Rect, Path } from '@react-pdf/renderer';
import { Task } from '../../lib/types/Task';
import { getDate } from '../../lib/i18n';
import { useTranslation } from 'react-i18next';
import { Collection } from '../../lib/types/Collection';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  title: { fontSize: 20, marginBottom: 10 },
  task: { fontSize: 12, marginBottom: 4 },
  table: { width: 'auto' },
  tableRow: { flexDirection: 'row'},
  firstTableColHeader: { width: '20%', borderStyle: 'solid', borderColor: '#000', borderBottomColor: '#000', borderWidth: 1, backgroundColor: '#bdbdbd' },
  tableColHeader: { width: '20%', borderStyle: 'solid', borderColor: '#000', borderBottomColor: '#000', borderWidth: 1, borderLeftWidth: 0, backgroundColor: '#bdbdbd' },
  firstTableCol: { width: '20%', borderStyle: 'solid', borderColor: '#000', borderWidth: 1, borderTopWidth: 0 },
  tableCol: { width: '20%', borderStyle: 'solid', borderColor: '#000', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCellHeader: { textAlign: 'center', margin: 4, fontSize: 12, fontWeight: 'bold' },
  tableCell: { textAlign: 'center', margin: 5, fontSize: 10 },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});

const Checkbox = ({ checked }: { checked: boolean }) => (
  <Svg width={12} height={12}>
    <Rect x="0" y="0" width="12" height="12" stroke="#000" strokeWidth="1" fill="none" />
    {checked && (
      <Path
        d="M2 6 L5 9 L10 3"
        stroke="#000"
        strokeWidth="1"
        fill="none"
      />
    )}
  </Svg>
);

function createTableHeader() {
  const { t } = useTranslation();
  return (
    <View style={styles.tableRow} fixed>

      <View style={styles.firstTableColHeader}>
        <Text style={styles.tableCellHeader}>{t("Status")}</Text>
      </View>

      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>{t("Name")}</Text>
      </View>

      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>{t("Description")}</Text>
      </View>

      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>{t("Duedate")}</Text>
      </View>
    </View>
  );
};

function createTableRow(task: Task) {
  const { t } = useTranslation();
  return (
    <View style={styles.tableRow}>

      <View style={styles.firstTableCol}>
        <View style={styles.tableCell}>
          <View style={styles.checkboxRow} >
            <Checkbox checked={task.status === "done"} />
            <Text style={{ marginLeft: 5 }}>{task.status === "done" ? t("Done") : t("Pending")}</Text>
          </View>
        </View>
      </View>

      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{task.names}</Text>
      </View>

      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{task.descriptions === "" ? t("NoDescription") : task.descriptions === null ? t("NoDescription") : task.descriptions}</Text>
      </View>

      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{task.due_date === null ? t("NoDue") : getDate(new Date(task.due_date))}</Text>
      </View>

    </View>
  );
};

export const BoardPDF = ({ boardName, collections, tasks }: { boardName: string, collections: Collection[] | undefined, tasks: Task[] | undefined }) => (
  <Document author='Yapuka' subject='Onglet PDF' title={boardName}>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{boardName}</Text>
        {collections?.map((collection, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.title}>{collection.names}</Text>
            <View style={styles.table}>
              {createTableHeader()}
              {tasks?.filter((task) => task.collection_id === collection.id)
                .map((task, index) => (
                <View key={index}>
                  {createTableRow(task)}
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);