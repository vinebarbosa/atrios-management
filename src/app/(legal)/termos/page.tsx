import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Serviço — Átrios Management",
  description: "Termos de Serviço da plataforma Átrios Management.",
};

const ATUALIZADO_EM = "8 de julho de 2026";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-base font-semibold text-fg-1">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-fg-5">
        {children}
      </div>
    </section>
  );
}

export default function TermosPage() {
  return (
    <article>
      <h1 className="text-2xl font-semibold tracking-tight text-fg-hi">
        Termos de Serviço
      </h1>
      <p className="mt-2 text-[13px] text-fg-7">
        Última atualização: {ATUALIZADO_EM}
      </p>

      <p className="mt-6 text-sm leading-relaxed text-fg-5">
        Estes Termos de Serviço (&ldquo;Termos&rdquo;) regem o acesso e o uso da
        plataforma Átrios Management (&ldquo;Plataforma&rdquo;), operada pela
        Átrios (&ldquo;nós&rdquo;). Ao criar uma conta ou utilizar a Plataforma,
        você concorda integralmente com estes Termos. Se você não concordar, não
        utilize a Plataforma.
      </p>

      <Section title="1. Descrição do serviço">
        <p>
          A Átrios Management é uma ferramenta interna de gestão dos produtos de
          software da Átrios. Ela permite, entre outras funcionalidades,
          organizar produtos e tarefas, gerenciar times, enviar convites de
          acesso e armazenar credenciais em um cofre de senhas.
        </p>
      </Section>

      <Section title="2. Conta e acesso">
        <p>
          O acesso à Plataforma é feito mediante convite. Ao criar sua conta,
          você se compromete a fornecer informações verdadeiras e a mantê-las
          atualizadas.
        </p>
        <p>
          Você é responsável por manter a confidencialidade das suas credenciais
          de acesso e por todas as atividades realizadas na sua conta.
          Notifique-nos imediatamente caso suspeite de uso não autorizado.
        </p>
      </Section>

      <Section title="3. Uso aceitável">
        <p>Ao utilizar a Plataforma, você concorda em não:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>usar a Plataforma para fins ilícitos ou não autorizados;</li>
          <li>
            tentar acessar contas, dados ou áreas da Plataforma às quais você
            não possui permissão;
          </li>
          <li>
            interferir no funcionamento da Plataforma, incluindo tentativas de
            sobrecarga, engenharia reversa ou exploração de vulnerabilidades;
          </li>
          <li>
            compartilhar credenciais armazenadas no cofre de senhas com pessoas
            não autorizadas.
          </li>
        </ul>
      </Section>

      <Section title="4. Cofre de senhas">
        <p>
          O cofre de senhas permite armazenar credenciais de serviços utilizados
          pelos times. As credenciais são armazenadas de forma criptografada.
          Ainda assim, o uso do cofre é de responsabilidade dos usuários:
          mantenha apenas credenciais necessárias ao trabalho e respeite as
          políticas internas de segurança da Átrios.
        </p>
      </Section>

      <Section title="5. Propriedade intelectual">
        <p>
          A Plataforma, incluindo seu código, design, marca e conteúdo, é de
          propriedade da Átrios ou de seus licenciantes. Estes Termos não
          concedem a você qualquer direito sobre a Plataforma além do direito de
          uso conforme aqui previsto.
        </p>
        <p>
          Os dados inseridos por você na Plataforma permanecem de titularidade
          da Átrios e/ou dos respectivos titulares, conforme aplicável.
        </p>
      </Section>

      <Section title="6. Disponibilidade e alterações do serviço">
        <p>
          Empregamos esforços razoáveis para manter a Plataforma disponível, mas
          não garantimos operação ininterrupta ou livre de erros. Podemos
          modificar, suspender ou descontinuar funcionalidades a qualquer
          momento, com ou sem aviso prévio.
        </p>
      </Section>

      <Section title="7. Limitação de responsabilidade">
        <p>
          Na máxima extensão permitida pela legislação aplicável, a Átrios não
          se responsabiliza por danos indiretos, lucros cessantes ou perda de
          dados decorrentes do uso ou da impossibilidade de uso da Plataforma.
        </p>
      </Section>

      <Section title="8. Suspensão e encerramento">
        <p>
          Podemos suspender ou encerrar o seu acesso à Plataforma em caso de
          violação destes Termos, das políticas internas da Átrios ou da
          legislação aplicável, bem como quando o vínculo que justificava o
          acesso deixar de existir.
        </p>
      </Section>

      <Section title="9. Privacidade">
        <p>
          O tratamento de dados pessoais na Plataforma é descrito na nossa{" "}
          <Link
            href="/privacidade"
            className="text-primary-fg underline-offset-4 transition-colors hover:text-primary-fg-hi hover:underline"
          >
            Política de Privacidade
          </Link>
          , que integra estes Termos.
        </p>
      </Section>

      <Section title="10. Alterações destes Termos">
        <p>
          Podemos atualizar estes Termos periodicamente. A versão vigente estará
          sempre disponível nesta página, com a data da última atualização
          indicada no topo. O uso continuado da Plataforma após alterações
          significa concordância com a nova versão.
        </p>
      </Section>

      <Section title="11. Legislação aplicável e contato">
        <p>
          Estes Termos são regidos pelas leis da República Federativa do Brasil.
          Dúvidas sobre estes Termos podem ser encaminhadas para{" "}
          <a
            href="mailto:contato@atrios.com.br"
            className="text-primary-fg underline-offset-4 transition-colors hover:text-primary-fg-hi hover:underline"
          >
            contato@atrios.com.br
          </a>
          .
        </p>
      </Section>
    </article>
  );
}
