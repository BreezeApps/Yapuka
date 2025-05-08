import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useSetState } from "react-use";
import { DatabaseService } from "../lib/dbClass";
import { useTranslation } from "react-i18next";

interface State {
  steps: Step[];
}

export function OnBoarding({
  run,
  setRun,
}: {
  run: boolean;
  setRun: (run: boolean) => void;
}) {
  const dbService = new DatabaseService();
  const { t } = useTranslation();
  const [{ steps }] = useSetState<State>({
    steps: [
      {
        content: t("Step0"),
        placement: "center",
        showProgress: false,
        target: "body",
      },
      {
        target: "#one-step",
        content: t("Step1"),
      },
      {
        target: "#two_one-step",
        content: t("Step2"),
      },
      {
        target: "#two-step",
        content: t("Step3"),
      },
      {
        target: "#three-step",
        content: t("Step4"),
      },
      {
        target: "#five-step",
        content: t("Step6"),
      },
      {
        target: "#seven-step",
        content: t("Step8"),
      },
      {
        target: "body",
        placement: "center",
        showProgress: false,
        content: t("Step9"),
      },
    ],
  });


  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      await dbService.updateOption("firstStart", "false")
    }
    // console.log(type, data);
  };

  return (
    <>
      <Joyride
        continuous
        callback={handleJoyrideCallback}
        run={run}
        scrollOffset={64}
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
        locale={{
          back: t("Back"),
          close: t("Close"),
          last: t("Last"),
          next: t("Next"),
          nextLabelWithProgress: t("NextWithStep"),
          skip: t("Skip"),
          open: t("Open"),
        }}
        styles={{
        buttonNext:{
            backgroundColor: "#4f46e5",
            color: "white",
        },
        buttonBack:{
            borderRadius: "4px",
            backgroundColor: "#4f46e5",
            color: "white",
        },
          options: {
            zIndex: 10000,
          },
        }}
      />
    </>
  );
}
