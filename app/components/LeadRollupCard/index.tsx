import { Box, Card, CardBody, Heading } from "@chakra-ui/react";
import { ResponsiveBar } from "@nivo/bar";
import React, { useEffect, useState } from "react";
import {
    FaBuilding,
    FaBullhorn,
    FaCar,
    FaChartPie,
    FaChurch,
    FaEnvelope,
    FaFacebook,
    FaGlobe,
    FaHospital,
    FaInstagram,
    FaLinkedin,
    FaNewspaper,
    FaPhone,
    FaPlane,
    FaTv,
    FaTwitter,
    FaUniversity,
    FaYoutube,
} from "react-icons/fa";

interface LeadRollupCardProps {
    title: string;
    counts: { label: string; count: number }[];
}

const ICONS = {
    envelope: FaEnvelope,
    globe: FaGlobe,
    phone: FaPhone,
    facebook: FaFacebook,
    twitter: FaTwitter,
    linkedin: FaLinkedin,
    instagram: FaInstagram,
    youtube: FaYoutube,
    newspaper: FaNewspaper,
    television: FaTv,
    megaphone: FaBullhorn,
    building: FaBuilding,
    hospital: FaHospital,
    university: FaUniversity,
    church: FaChurch,
    airplane: FaPlane,
    car: FaCar,
    chart: FaChartPie,
};

const LeadRollupCard: React.FC<LeadRollupCardProps> = ({ title, counts }) => {
    const [statusMap, setStatusMap] = useState({});
    const [sourceMap, setSourceMap] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const statusResponse = await fetch("/api/getLeadStatuses");
            const sourceResponse = await fetch("/api/getAllLeadSources");
            const statuses = await statusResponse.json();
            const sources = await sourceResponse.json();

            const statusMap = statuses.reduce((acc, status) => {
                acc[status.status_id] = {
                    name: status.status_name,
                    color: status.badge_color_hexcode,
                };
                return acc;
            }, {});

            const sourceMap = sources.reduce((acc, source) => {
                acc[source.id] = { name: source.name, icon: source.icon };
                return acc;
            }, {});

            setStatusMap(statusMap);
            setSourceMap(sourceMap);
        };

        fetchData();
    }, []);

    const data = counts.map(({ label, count }) => {
        const isSourceCount = title.includes("Source Counts");
        const isStatusCount = title.includes("Status Counts");

        const displayLabel = isSourceCount
            ? sourceMap[label]?.name || "No Source"
            : isStatusCount
            ? statusMap[label]?.name || "No Status"
            : "N/A";

        return {
            label: displayLabel,
            count,
            color: isStatusCount ? statusMap[label]?.color : undefined,
            icon: isSourceCount ? ICONS[sourceMap[label]?.icon] : null,
        };
    });

    const CustomLayer = ({ bars }) => (
        <g>
            {bars.map((bar) => {
                const datum = bar.data;
                return (
                    <g
                        key={bar.key}
                        transform={`translate(${bar.x + 4}, ${
                            bar.y + bar.height / 2
                        })`}
                    >
                        {datum.data.icon && (
                            <text
                                x={0}
                                y={20}
                                textAnchor="middle"
                                dominantBaseline="central"
                                style={{ fontSize: 20 }}
                            >
                                {React.createElement(datum.data.icon)}
                            </text>
                        )}
                        {datum.data.label && (
                            <text
                                x={bar.width + 10}
                                y={0}
                                textAnchor="start"
                                dominantBaseline="central"
                                style={{ fontSize: 14 }}
                            >
                                {datum.data.label}
                            </text>
                        )}
                    </g>
                );
            })}
        </g>
    );

    return (
        <Card
            w="full"
            boxShadow="lg"
            borderWidth="1px"
            borderColor="gray.200"
        >
            <CardBody>
                <Heading size="md" fontWeight="semibold">
                    {title}
                </Heading>
                <Box height="35vh">
                    <ResponsiveBar
                        data={data}
                        keys={["count"]}
                        indexBy="count"
                        layout="horizontal"
                        margin={{ top: 0, right: 100, bottom: 0, left: 0 }}
                        padding={0.3}
                        colors={({ data }) => data.color || "#D3D3D3"}
                        axisBottom={null}
                        axisLeft={null}
                        enableLabel={true}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor={{
                            from: "color",
                            modifiers: [["darker", 1.6]],
                        }}
                        layers={["grid", "axes", "bars", CustomLayer]}
                    />
                </Box>
            </CardBody>
        </Card>
    );
};

export default LeadRollupCard;
