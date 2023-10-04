import { Box, Typography, useTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import Header from "../../components/Header";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { tokens } from "../../theme";

const SettingsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      sx={{
        margin: "1rem",
        textAlign: "center",
      }}
    >
      <Header permanent title="FAQ" />
      <Box
        sx={{
          margin: "1rem",
        }}
      >
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                color: colors.greenAccent[500],
                fontSize: "1.5rem",
              }}
              variant="h5"
            >
              INTRODUCTION
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",
                maxHeight: "75vh",
                overflow: "auto",
              }}
            >
              <Typography
                sx={{
                  color: colors.primary[100],
                  fontSize: "1.2rem",
                  textAlign: "left",
                }}
                variant="body1"
              >
                Welcome to the Metrics app.
                <br></br>
                <br></br>
                With the help of Metrics you can record, track, measure, and
                compare all your personal performance data.
                <br></br>
                <br></br>
                Have you ever wondered how your sleep affects your work
                productivity? Or how your stress impacts your exercise
                performance? Metrics will show you how.
                <br></br>
                <br></br>
                First up is your dashboard.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the dashboard."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/dashboard.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                The graph at the top of the screen will display your data on a
                line chart.
                <br></br>
                To begin with there will only be a single metric titled 'Default
                Data'.
                <br></br>
                You can rename it at any time.
                <br></br>
                <br></br>
                You also have your first category, titled 'Dashboard'.
                <br></br>
                Categories are collections of metrics that can be used to
                display multiple sets of data across a single line chart.
                <br></br>
                This will give you an opportunity to identify connections and
                patterns in your data.
                <br></br>
                <br></br>
                You can't rename the dashboard category, but you'll get the
                chance to create your own soon.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the date selection bar."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/date-selection.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                Underneath the chart, the date selection bar will allow you to
                bring up data within a selected range.
                <br></br>
                <br></br>
                Currently you can only view as far back as the first date in
                your history, but we have plans to allow users to backdate their
                data in future versions of Metrics.
                <br></br>
                <br></br>
                To select your chosen dates, enter them into the 'start date'
                and 'end date' boxes using the MM/DD/YY format.
                <br></br>
                Then press the 'go to date' button.
                <br></br>
                <br></br>
                Your chart will then display its contents between the start and
                end dates.
                <br></br>
                <br></br>
                Hover over the chart on a specific day, or tap if you're on a
                mobile device, and the chart will display a list of the
                displayed data for that day.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the tooltip."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/tooltip.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                At the bottom of your screen you will see the 'Quick Update'
                bar.
                <br></br>
                Open it by clicking on it.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the quick update bar."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/quick-update.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                Inside this bar you will see all your current metrics listed
                along with a data entry field.
                <br></br>
                To add a data value for the current day, enter it into the entry
                field and click the 'add' button.
                <br></br>
                The chart will update immediately to show your new data.
                <br></br>
                <br></br>
                Below the quick update bar, the 'recent activity' bar contains a
                list of the last 7 days and the data for any metrics entered on
                that day. Open it by clicking on it.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the recent activity bar."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/recent-activity.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                To jump to a specific day and view the activity chart for that
                day, click on the box containing the day and its data.
                <br></br>
                Or enter a range of days using the date selection tool contained
                inside the recent activity bar and click on the 'go to date'
                button.
                <br></br>
                <br></br>
                Lastly is the 'add data' bar. Open it by clicking on it.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the add data bar."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/add-data.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                This bar contains everything you need to add a new metric for
                measurement.
                <br></br>
                Enter the name of your new metric and if you want to enter data
                for a specific day straight away, you can add that as well.
                <br></br>
                You can also select a data type.
                <br></br>
                Currently Metrics allows users to measure data in a scale from
                1-10 or as a number.
                <br></br>
                More data types are planned for later versions. To tell your
                metrics apart you will want to select colours for them.
                <br></br>
                Use the colour picker to do this and click 'track new metric' to
                add your new metric to the list.
                <br></br>
                <br></br>
                You can also add categories to group your data together.
                <br></br>
                Enter a name for your category and click the 'track new
                category' button to add one.
                <br></br>
                <br></br>
                To see a list of your data and categories, open the sidebar menu
                by clicking the menu button in the top left corner of your
                screen.
                <br></br>
                To close the menu, click outside the sidebar or click
                'navigation' along the top of the sidebar menu.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the sidebar."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/sidebar.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                The top button on the menu will return you to the dashboard at
                any time.
                <br></br>
                <br></br>
                The button below will take you to your journal where you can
                view notes you've written about a specific day.
                <br></br>
                <br></br>
                Below the journal button is a list of your categories.
                <br></br>
                <br></br>
                And below your categories is a list of all your metrics.
                <br></br>
                <br></br>
                Click on one of your categories and you will be taken to the
                page for that category.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the category page."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/category.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                You will notice the layout is mostly the same as your dashboard.
                <br></br>
                The only difference is the 'add/remove metric' bar at the bottom
                of the screen.
                <br></br>Open it by clicking on it. Here you can select which
                metrics from your list you wish to display in the selected
                category.
                <br></br>Once you're done selecting your metrics, click the
                'add/remove' button and the chart will update. If you've
                selected metrics with different data types, you'll notice the
                chart now has 2 axes displaying those data types.
                <br></br>
                Below the chart the legend allows you to hide or display each
                metric by clicking on its name.
                <br></br>
                <br></br>
                Underneath the 'add/remove metric' bar is the 'history' bar.
                <br></br>
                Open it by clicking on it.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the history bar."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/history.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                The history bar displays a list of collapsible boxes for each of
                your metrics.
                <br></br>
                Open one by clicking on it.
                <br></br>
                The box that opens up will display the name of the selected
                metric, the averages of the data for that metric between the
                selected dates, and a list of your data seperated by day.
                <br></br>
                <br></br>
                Return to the sidebar and select a metric.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the metric page."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/metric.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                The metric page will display a single metric and its data for
                you to view.
                <br></br>
                To rename a metric, click the <EditOutlinedIcon/> icon next to the title.
                <br></br>
                <br></br>
                Enter a new title into the entry field and click the 'confirm'
                button to rename the metric.
                <br></br>
                <br></br>
                As with the category page, the metric page contains the same
                chart you will already be familiar with.
                <br></br>
                <br></br>
                At the bottom of the screen, the 'add data' bar allows you to
                enter a value and choose the day for that value to be assigned
                to, so you can go back and edit previous days if you need to.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the metric options."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/metric-options.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                However, you cannot currently edit days before the first entry
                in the app.
                <br></br>
                This option is planned for later versions.
                <br></br>
                <br></br>
                The 'colour' bar lets you select a new colour for your metric.
                <br></br>
                To change colour, select your new colour and click the 'add
                measurement' button in the 'add data' bar.
                <br></br>
                <br></br>
                The 'set goal' bar allows you to add a goal to work towards for
                each metric.
                <br></br>
                To add a goal enter a value into the entry field and click the
                'set goal' button.
                <br></br>
                Once set your goal will be displayed as a ring containing a
                number by the title.
                <br></br>
                Entering a value for the current day will measure your progress
                against your goal and display as the ring filling with a green
                colour.
                <br></br>
                You will also be able to see your current progress compared to
                your goal as measured by the numbers inside the ring.
                <br></br>
                <br></br>
                The 'add note' bar allows you to add extra information to the
                current day's entry.
                <br></br>
                In later versions it is planned to allow for notes to be added
                to previous days.
                <br></br>
                <br></br>
                The 'history' bar acts the same as the version you've already
                seen on the category page.
                <br></br>
                <br></br>
                Lastly, the 'correlation' bar allows you to directly compare the
                currently displayed metric with another.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the correlation bar."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/correlation.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                Select the metric you wish to compare with and click the
                'add/remove' button.
                <br></br>
                The bar will display two history boxes for the selected metrics.
                <br></br>
                It will also provide a value for the correlation between the two
                metrics, so you can see if they share any pattern in their
                relationship.
                <br></br>
                Values range from Very Low to Very High.
                <br></br>
                <br></br>
                Return to the dashboard and click a date in the 'recent
                activity' bar.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the activity page."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/activity.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                As before you will be able to see a chart page containing the
                data for the date you selected.
                <br></br>
                When a single day is selected you will also be able to see data
                for the previous day and the following day.
                <br></br>
                The 'date selction bar' will function as before.
                <br></br>
                However, you may also notice that the title of the page also
                contains two new buttons.
                <br></br>
                These allow you to select the previous or following day for
                display.
                <br></br>
                <br></br>
                At the bottom of the page, the 'add journal' bar will allow you
                to add a journal entry for any single day.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the journal."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/journal.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                Enter your text into the entry field and click the 'add journal'
                button to save it.
                <br></br>
                <br></br>
                Your entry can be viewed on the journal page, which is
                accessible via the sidebar menu.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the journal page."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/journal.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                To find a specific entry in the journal, you can search using
                the 'search' bar.
                <br></br>
                <br></br>
                Or alternatively if there are more than 7 entries in the
                journal, you can find it on the relevant page.
                <br></br>
                Clicking on the date above the journal entry will take you to
                the specified date where you can edit your journal entry.
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <Box
                  alt="an image of the settings page."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/settings.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                At the top of the app, clicking the 'settings icon' will lead
                you to the settings page.
                <br></br>
                There you chave the option to delete metrics, categories,
                journal entries, or all your data at once.
                <br></br>
                Click one of the bars to open up a list of all the data of that
                type.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the settings options."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/settings-options.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "90vw",
                  }}
                />
                <br></br>
                <br></br>
                Click on a data entry and a pop up will appear to ask for
                confirmation.
                <br></br>
                Click the 'yes' button to confirm deletion of the entry or
                cancel by clicking the 'no' button.
                <br></br>
                Click the 'import data' button to select a single .txt file
                containing Metrics data to load.
                <br></br>
                Click the 'export data' button to create a backup of your data
                on your device as a .txt file.
                <br></br>
                <br></br>I hope you find Metrics useful and if you have any
                suggestions for additional features, or if you encounter any
                bugs or problems using the app, be sure to let me know at&nbsp;
                <Typography
                  component="a"
                  href="mailto:GJMShrigley@gmail.com"
                  sx={{
                    fontSize: "1.2rem",
                    color: colors.greenAccent[500],
                  }}
                  variant="body1"
                >
                  GJMShrigley@gmail.com
                </Typography>
                .
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default SettingsPage;
