import { Box, Typography, useTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import Header from "../../components/Header";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { tokens } from "../../theme";

const FaqPage = () => {
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
                Welcome to the Metrix app.
                <br></br>
                <br></br>
                With the help of Metrix you can record, track, measure, and
                compare all your personal performance data.
                <br></br>
                <br></br>
                Have you ever wondered how your sleep affects your work
                productivity? Or how your stress impacts your exercise
                performance? Metrix will show you how.
                <br></br>
                <br></br>
                I hope you find Metrix useful and if you have any
                suggestions for additional features, or if you encounter any
                bugs or problems using the app, be sure to let me know at&nbsp;
                <br></br>
                <Typography
                  component="a"
                  href="mailto:metrixmeasurements@gmail.com"
                  sx={{
                    fontSize: "1.2rem",
                    color: colors.greenAccent[500],
                  }}
                  variant="body1"
                >
                  MetrixMeasurements@gmail.com
                </Typography>
                .
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                color: colors.greenAccent[500],
                fontSize: "1.5rem",
              }}
              variant="h5"
            >
              DASHBOARD
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",

                overflow: "hidden",
              }}
            >
              <Typography
                sx={{
                  color: colors.primary[100],
                  fontSize: "1.2rem",
                  width: "95%",
                  textAlign: "left",
                }}
                variant="body1"
              >
                First up is your dashboard.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the dashboard."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/dashboard.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "70vw",
                  }}
                />
                <br></br>
                <br></br>
                The graph at the top of the screen will display your data on a
                line chart.
                <br></br>
                <br></br>
                To begin with there will only be a single metric titled 'Default
                Data'.
                <br></br>
                <br></br>
                You can rename it at any time.
                <br></br>
                <br></br>
                You also have your first category, titled 'Dashboard'.
                <br></br>
                <br></br>
                Categories are collections of metrics that can be used to
                display multiple sets of data across a single line chart.
                <br></br>
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
                    maxWidth: "70vw",
                  }}
                />
                <br></br>
                <br></br>
                Underneath the chart, the date selection bar will allow you to
                bring up data within a selected range.
                <br></br>
                <br></br>
                Currently you can only view as far back as the first date in
                your history.
                <br></br>
                <br></br>
                To select your chosen dates, select the 'Start Date' or 'End Date' fields.
                This will bring up a menu allowing you to select your chosen dates.
                <br></br>
                <br></br>
                Then press the 'go to date' button.
                <br></br>
                <br></br>
                Your chart will then display its contents between the start and
                end dates.
                <br></br>
                <br></br>
                Tap the chart on a specific day to display the data entries for that day.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the tooltip."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/tooltip.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "70vw",
                  }}
                />
                <br></br>
                <br></br>
                At the bottom of your screen you will see the 'Quick Update'
                bar.
                <br></br>
                <br></br>
                Open it by tapping on it.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the quick update bar."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/quick-update.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "70vw",
                  }}
                />
                <br></br>
                <br></br>
                Inside this bar you will see all your current metrics listed
                along with a data entry field.
                <br></br>
                <br></br>
                To add a data value for the current time and day, enter it into the entry
                field.
                <br></br>
                <br></br>
                To visit the chart page for the respective Metric, tap the title of the metric.
                <br></br>
                <br></br>
                The chart will update immediately to show your new data. (Note: when multiple entries
                are made for a single day, the result for that day will display either an average or
                cumulative total of all entries. This can be changed on the page for that metric.)
                <br></br>
                <br></br>
                Below the quick update bar, the 'recent activity' bar contains a
                list of the last 7 days and the data for any metrics entered on
                that day. Open it by tapping it.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the recent activity bar."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/recent-activity.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "70vw",
                  }}
                />
                <br></br>
                <br></br>
                To jump to a specific day and view the activity chart for that
                day, tap on the box containing the day and its data.
                <br></br>
                <br></br>
                Or enter a range of days using the date selection tool contained
                inside the recent activity bar and tap on the 'go to date'
                button.
                <br></br>
                <br></br>
                Lastly is the 'add data' bar. Open it by tapping on it.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the add data bar."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/add-data.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "70vw",
                  }}
                />
                <br></br>
                <br></br>
                This bar contains everything you need to add a new metric for
                measurement.
                <br></br>
                <br></br>
                Enter the name of your new metric and any data for the current time and day.
                <br></br>
                <br></br>
                You can also select a data type.
                <br></br>
                <br></br>
                Currently Metrix allows users to measure data in a scale from
                1-10 or as a number.
                <br></br>
                <br></br>
                You can also select a total type for entries made on the same day. Average will
                record a Mean Average of all data entries made on the same day. Cumulative will
                record a sum of all entries made on the same day.
                <br></br>
                <br></br>
                To tell your metrics apart you will want to select colours for them.
                <br></br>
                <br></br>
                Use the colour picker to do this and tap 'track new metric' to
                add your new metric to the list.
                <br></br>
                <br></br>
                You can also add categories to group your data together.
                <br></br>
                <br></br>
                Enter a name for your category and tap the 'track new
                category' button to add one.
                <br></br>
                <br></br>
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                color: colors.greenAccent[500],
                fontSize: "1.5rem",
              }}
              variant="h5"
            >
              SIDEBAR
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",

                overflow: "hidden",
              }}
            >
              <Typography
                sx={{
                  color: colors.primary[100],
                  fontSize: "1.2rem",
                  width: "95%",
                  textAlign: "left",
                }}
                variant="body1"
              >
                The Sidebar contains a list of your data and categories, open the sidebar menu
                by tapping the menu icon in the top left corner of your
                screen.
                <br></br>
                <br></br>
                To close the menu, tap outside the sidebar or tap
                'navigation' along the top of the sidebar menu.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the sidebar."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/sidebar.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "70vw",
                  }}
                />
                <br></br>
                <br></br>
                The Dashboard button will return you to the dashboard at
                any time.
                <br></br>
                <br></br>
                The Journal button will take you to your journal where you can
                view notes you've written about a specific day.
                <br></br>
                <br></br>
                The Correlation button will take you to a spreadsheet that cross-refernces
                all of your metrics so you can see which ones share a correlation.
                <br></br>
                <br></br>
                Below the Correlation button, a date selector will take you to the activity
                page displaying data for the selected dates.
                <br></br>
                <br></br>
                Below the date selector button is a list of your categories.
                <br></br>
                <br></br>
                And below your categories is a list of all your metrics.
                <br></br>
                <br></br>
                Tap on one of your categories or metrics and you will be taken to the
                relevant page.
                <br></br>
                <br></br>
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                color: colors.greenAccent[500],
                fontSize: "1.5rem",
              }}
              variant="h5"
            >
              CATEGORY PAGE
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",

                overflow: "hidden",
              }}
            >
              <Typography
                sx={{
                  color: colors.primary[100],
                  fontSize: "1.2rem",
                  width: "95%",
                  textAlign: "left",
                }}
                variant="body1"
              >
                <Box
                  alt="an image of the category page."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/category.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "70vw",
                  }}
                />
                <br></br>
                <br></br>
                The layout of the Category Page is mostly the same as the dashboard.
                <br></br>
                <br></br>
                The only difference is the 'add/remove metric' bar at the bottom
                of the screen.
                <br></br>
                <br></br>Open it by tapping on it. Here you can select which
                metrics from your list you wish to display in the selected
                category.
                <br></br>
                <br></br>
                Once you're done selecting your metrics, tap to close the menu. Tap the
                'add/remove' button and the chart will update. If you've
                selected metrics with different data types, you'll notice the
                chart now has 2 axes displaying those data types.
                <br></br>
                <br></br>
                Below the chart the legend allows you to hide or display each
                metric on the chart by tapping on its name.
                <br></br>
                <br></br>
                Underneath the 'add/remove metric' bar is the 'history' bar.
                <br></br>
                <br></br>
                Open it by tapping on it.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the history bar."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/history.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "70vw",
                  }}
                />
                <br></br>
                <br></br>
                The history bar displays a list of collapsible boxes for each of
                your metrics.
                <br></br>
                <br></br>
                Open one by tapping on it.
                <br></br>
                <br></br>
                The box that opens up will display the name of the selected
                metric, the averages of the data for that metric between the
                selected dates, and a list of your data seperated by day.
                <br></br>
                <br></br>
                You can visit a metric's chart page or the activity page for a specific
                date by tapping on the title of the metric or the chosen date.
                <br></br>
                <br></br>
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                color: colors.greenAccent[500],
                fontSize: "1.5rem",
              }}
              variant="h5"
            >
              METRIC PAGE
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",

                overflow: "hidden",
              }}
            >
              <Typography
                sx={{
                  color: colors.primary[100],
                  fontSize: "1.2rem",
                  width: "95%",
                  textAlign: "left",
                }}
                variant="body1"
              >
                <Box
                  alt="an image of the metric page."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/metric.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "70vw",
                  }}
                />
                <br></br>
                <br></br>
                The metric page will display a single metric and its data for
                you to view.
                <br></br>
                <br></br>
                To rename a metric, tap the <EditOutlinedIcon /> icon next to the title.
                <br></br>
                <br></br>
                Enter a new title into the entry field and tap the 'confirm'
                button to rename the metric.
                <br></br>
                <br></br>
                As with the category page, the metric page contains the same
                chart you will already be familiar with.
                <br></br>
                <br></br>
                At the bottom of the screen, the 'add data' bar allows you to
                enter a value and choose the time and day for that value to be assigned
                to, so you can go back and edit previous entries if you need to. However, you cannot
                currently edit days before the first entry in the app.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the metric options."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/metric-options.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "70vw",
                  }}
                />
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                The 'measurement type' field allows you to choose whether the metric corresponds to a
                scale of 1-10 or an arbitrary number.
                <br></br>
                <br></br>
                The 'measurement total' field allows you to choose if the total for multiple entries in a
                single day is counted as an average of all entries, or as a cumulative sum or all entries.
                <br></br>
                <br></br>
                The 'colour' bar lets you select a new colour for your metric.
                <br></br>
                <br></br>
                To change colour, select your new colour and tap the 'add
                measurement' button in the 'add data' bar.
                <br></br>
                <br></br>
                The 'set goal' bar allows you to add a goal to work towards for
                each metric.
                <br></br>
                <br></br>
                To add a goal enter a value into the entry field and tap the
                'set goal' button.
                <br></br>
                <br></br>
                You can also select whether a goal is 'high' or 'low'. (e.g. whether you are aiming for a total
                above, or below the goal respectively.)
                <br></br>
                <br></br>
                Once set your goal will be displayed as a ring containing a
                number by the title.
                <br></br>
                <br></br>
                Entering a value for the current day will measure your progress
                against your goal and display as the ring filling from red to green
                for a high goal. Overshooting a low goal will cause the ring to turn from green to red.
                <br></br>
                <br></br>
                You will also be able to see your current progress compared to
                your goal as measured by the numbers inside the ring.
                <br></br>
                <br></br>
                The 'add note' bar allows you to add extra information about the
                entry.
                <br></br>
                <br></br>
                The 'history' bar acts the same as the version you've already
                seen on the category page.
                <br></br>
                <br></br>
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                color: colors.greenAccent[500],
                fontSize: "1.5rem",
              }}
              variant="h5"
            >
              ACTIVITY PAGE
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",

                overflow: "hidden",
              }}
            >
              <Typography
                sx={{
                  color: colors.primary[100],
                  fontSize: "1.2rem",
                  width: "95%",
                  textAlign: "left",
                }}
                variant="body1"
              >
                <Box
                  alt="an image of the activity page."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/activity.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "70vw",
                  }}
                />
                <br></br>
                <br></br>
                As before you will be able to see a chart page containing the
                data for the date you selected.
                <br></br>
                <br></br>
                When a single day is selected you will also be able to see the
                data for the selected day. If there are multiple entries during a single
                day you will be able to see the indivudal times here.
                <br></br>
                <br></br>
                The 'date selction bar' will function as before.
                <br></br>
                <br></br>
                However, you may also notice that the title of the page also
                contains two new buttons.
                <br></br>
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
                  src={process.env.PUBLIC_URL + "/assets/journal-entry.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "70vw",
                  }}
                />
                <br></br>
                <br></br>
                Enter your text into the entry field and tap the 'add journal'
                button to save it.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                color: colors.greenAccent[500],
                fontSize: "1.5rem",
              }}
              variant="h5"
            >
              JOURNAL PAGE
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",

                overflow: "hidden",
              }}
            >
              <Typography
                sx={{
                  color: colors.primary[100],
                  fontSize: "1.2rem",
                  width: "95%",
                  textAlign: "left",
                }}
                variant="body1"
              >
                <br></br>
                <br></br>
                Your journal entries can be viewed on the journal page, which is
                accessible via the sidebar menu.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the journal page."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/journal.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "70vw",
                  }}
                />
                <br></br>
                <br></br>
                To find a specific entry in the journal, you can search for a specific text term using
                the 'search' bar.
                <br></br>
                <br></br>
                Or alternatively if there are more than 7 entries in the
                journal, you can find it on the relevant page.
                <br></br>
                <br></br>
                tapping on the date above the journal entry will take you to
                the specified date where you can edit your journal entry.
                <br></br>
                <br></br>
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                color: colors.greenAccent[500],
                fontSize: "1.5rem",
              }}
              variant="h5"
            >
              SETTINGS PAGE
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",

                overflow: "hidden",
              }}
            >
              <Typography
                sx={{
                  color: colors.primary[100],
                  fontSize: "1.2rem",
                  width: "95%",
                  textAlign: "left",
                }}
                variant="body1"
              >
                <Box
                  alt="an image of the settings page."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/settings.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "70vw",
                  }}
                />
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                At the top of the app, tapping the 'settings icon' will lead
                you to the settings page.
                <br></br>
                <br></br>
                There you have the option to delete metrics, categories,
                journal entries, or all your data at once.
                <br></br>
                <br></br>
                Tap one of the bars to open up a list of all the data of that
                type.
                <br></br>
                <br></br>
                <Box
                  alt="an image of the settings options."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/settings-options.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "70vw",
                  }}
                />
                <br></br>
                <br></br>
                Tap on a data entry and a pop up will appear to ask for
                confirmation.
                <br></br>
                <br></br>
                Tap the 'yes' button to confirm deletion of the entry or
                cancel by tapping the 'no' button.
                <br></br>
                <br></br>
                Tap the 'import data' button to select a single .txt file
                containing Metrix data to load.
                <br></br>
                <br></br>
                Tap the 'export data' button to create a backup of your data
                on your device as a .txt file that can be found in your documents
                directory. If you wish to keep multiple backups, make sure to rename
                this file before Exporting again.
                <br></br>
                <br></br>
                It is recommended that you regularly backup your Metrix data. The
                developer will not be held responsible for loss of data.
                <br></br>
                <br></br>
              </Typography>
            </Box>
          </AccordionDetails >
        </Accordion >
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                color: colors.greenAccent[500],
                fontSize: "1.5rem",
              }}
              variant="h5"
            >
              CORRELATION PAGE
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",

                overflow: "hidden",
              }}
            >
              <Typography
                sx={{
                  color: colors.primary[100],
                  fontSize: "1.2rem",
                  width: "95%",
                  textAlign: "left",
                }}
                variant="body1"
              >
                <Box
                  alt="an image of the settings options."
                  component="img"
                  src={process.env.PUBLIC_URL + "/assets/correlation.png"}
                  sx={{
                    height: "auto",
                    maxWidth: "70vw",
                  }}
                />
                The Correlation Page displays a spreadsheet of all metrics and
                their relation to one another. By cross-referencing a the X and Y
                axes of the chart you can find the correlation of any 2 metrics.
                <br></br>
                <br></br>
                A high correlation (over 0.75) will be shown with a green background, a medium
                correlation (between 0.5 and 0.75) with a blue background, a low correlation
                (between 0.25 and 0.5)  with a yellow background, a very low correlation
                (between 0 and 0.25) with an orange background, and no or negative correlation
                (0 or below) with a red background.
                <br></br>
                <br></br>
                This will allow you to identify which metrics have a strong or weak
                connection to one another.
              </Typography>
            </Box>
          </AccordionDetails >
        </Accordion >
      </Box >
    </Box >
  );
};

export default FaqPage;
