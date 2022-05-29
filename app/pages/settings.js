import DashBoardLayout from "app/core/layouts/DashBoardLayout"
import { Container, Button } from "react-bootstrap"
import { useMutation } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import settingsMut from "app/auth/mutations/settings"
import { SettingsValidation } from "app/auth/validations"
import { useSettings } from "app/core/hooks/useSettings"
import moment from "moment"

export default function Settings() {
  const [settingsMutation] = useMutation(settingsMut)
  const settings = useSettings()

  return (
    <>
      <Container fluid className="d-flex align-items-center">
        <Form
          className="w-50 mx-auto"
          schema={SettingsValidation}
          initialValues={{
            id: 1,
            apiAddress: settings.apiAddress,
            apiPort: settings.apiPort,
            apiKey: settings.apiKey,
            apiSecret: settings.apiSecret,
            failureTime: moment.utc(settings.failureTime).format("HH:mm:ss"),
          }}
          onSubmit={async (values) => {
            try {
              await settingsMutation(values)
            } catch (error) {
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        >
          <LabeledTextField name="apiAddress" label="API Address" type="text" />
          <LabeledTextField name="apiPort" label="API Port" type="text" placeholder="1234" />
          <LabeledTextField name="apiKey" label="API Key" type="text" />
          <LabeledTextField name="apiSecret" label="API Secret" type="password" />
          <LabeledTextField name="failureTime" label="Failure time" type="time" step="10" />
          <Button type="submit">Save</Button>
        </Form>
      </Container>
    </>
  )
}

Settings.getLayout = (page) => <DashBoardLayout title="Settings">{page}</DashBoardLayout>
