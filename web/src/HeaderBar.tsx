import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { ReactComponent as DetailViewIcon } from "./assets/svg/detail-view-icon.svg"
import { ReactComponent as LogoWordmarkSvg } from "./assets/svg/logo-wordmark.svg"
import { ReactComponent as TableViewIcon } from "./assets/svg/table-view-icon.svg"
import { CustomNav } from "./CustomNav"
import { GlobalNav, MenuButtonMixin } from "./GlobalNav"
import { usePathBuilder } from "./PathBuilder"
import {
  AllResourceStatusSummary,
  ResourceStatusSummaryRoot,
} from "./ResourceStatusSummary"
import { useSnapshotAction } from "./snapshot"
import SrOnly from "./SrOnly"
import { AnimDuration, Color, Font, FontSize, SizeUnit } from "./style-helpers"
import { showUpdate } from "./UpdateDialog"

const HeaderBarRoot = styled.nav`
  display: flex;
  align-items: center;
  padding-left: ${SizeUnit(1)};
  background-color: ${Color.grayDarkest};

  ${ResourceStatusSummaryRoot} {
    justify-self: center;
    flex-grow: 1;
    justify-content: center;
  }
`

const Logo = styled(LogoWordmarkSvg)`
  justify-self: flex-start;
  & .fillStd {
    transition: fill ${AnimDuration.short} ease;
    fill: ${Color.grayLightest};
  }
  &:hover .fillStd,
  &.isSelected .fillStd {
    fill: ${Color.gray7};
  }
  display: block;
`

const HeaderDivider = styled.div`
  border-left: 1px solid ${Color.grayLighter};
  height: ${SizeUnit(1)};
  margin: ${SizeUnit(0.5)};
`

const AllResourcesLink = styled(Link)`
  font-family: ${Font.monospace};
  color: ${Color.gray7};
  font-size: ${FontSize.small};
  text-decoration: none;
`

const ViewLinkText = styled.span`
  bottom: 0;
  color: ${Color.gray7};
  font-family: ${Font.monospace};
  font-size: ${FontSize.smallest};
  opacity: 0;
  position: absolute;
  text-align: center;
  transition: opacity ${AnimDuration.default} ease;
  white-space: nowrap;
  width: 100%;
`

const ViewLink = styled(Link)`
  ${MenuButtonMixin}
  padding-left: 0;
  padding-right: 0;
  position: relative;
  text-decoration: none;

  &:is(:hover, :focus, :active) {
    ${ViewLinkText} {
      opacity: 1;
    }
  }
`

const ViewLinkSection = styled.div`
  align-items: center;
  display: flex;
  margin-left: ${SizeUnit(1)};
  margin-right: ${SizeUnit(1)};
`

type HeaderBarProps = {
  view: Proto.webviewView
}

export default function HeaderBar(props: HeaderBarProps) {
  let isSnapshot = usePathBuilder().isSnapshot()
  let snapshot = useSnapshotAction()
  let view = props.view
  let session = view?.uiSession?.status
  let runningBuild = session?.runningTiltBuild
  let suggestedVersion = session?.suggestedTiltVersion
  let resources = view?.uiResources || []

  let globalNavProps = {
    isSnapshot,
    snapshot,
    showUpdate: showUpdate(view),
    suggestedVersion,
    runningBuild,
    tiltCloudUsername: session?.tiltCloudUsername ?? "",
    tiltCloudSchemeHost: session?.tiltCloudSchemeHost ?? "",
    tiltCloudTeamID: session?.tiltCloudTeamID ?? "",
    tiltCloudTeamName: session?.tiltCloudTeamName ?? "",
  }

  const pb = usePathBuilder()

  // TODO: Get current link ... or perhaps this is just set in props lol
  // TODO: Add aria-current property to links

  // TODO (lizz): Consider refactoring to more semantic html with <ul> + <li> items
  return (
    <HeaderBarRoot aria-label="Dashboard menu">
      <Link to="/overview" role="menuitem" aria-label="Tilt home">
        <Logo width="57px" />
      </Link>
      <ViewLinkSection>
        <ViewLink to="/overview" role="menuitem">
          <TableViewIcon role="presentation" />
          <ViewLinkText>
            Table <SrOnly>View</SrOnly>
          </ViewLinkText>
        </ViewLink>
        <HeaderDivider role="presentation" />
        <ViewLink to={pb.encpath`/r/(all)/overview`} role="menuitem">
          <DetailViewIcon role="presentation" />
          <ViewLinkText>
            Detail <SrOnly>View</SrOnly>
          </ViewLinkText>
        </ViewLink>
      </ViewLinkSection>
      <AllResourceStatusSummary resources={resources} />
      <CustomNav view={props.view} />
      <GlobalNav {...globalNavProps} />
    </HeaderBarRoot>
  )
}
