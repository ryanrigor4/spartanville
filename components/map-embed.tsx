import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MapEmbed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SJSU Campus Map</CardTitle>
      </CardHeader>
      <CardContent>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.3325395304414!2d-121.88247468467422!3d37.33581797984237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fccb864de43d5%3A0x397ffe721937340e!2sSan%20Jos%C3%A9%20State%20University!5e0!3m2!1sen!2sus!4v1659432119451!5m2!1sen!2sus"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </CardContent>
    </Card>
  )
}

